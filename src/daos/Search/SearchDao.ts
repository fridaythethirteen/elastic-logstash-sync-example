import { ISearch } from '@entities/Search';
import { doPost, ApiConstants } from '@api';
import { Response } from 'node-fetch';


interface IBucket { key: string; doc_count: number };

interface IHits { _score: number; _source: ISearch };

interface IError {
    error?: any
}

export interface IResponse extends IError {
    hits: {
        hits: IHits[];
    },
    aggregations: {
        Category_Facets: {
            buckets: IBucket[];
        },
        Address_Facets: {
            buckets: IBucket[];
        }
    }
}

export interface ISearchParams {
    filter: {
        maxPrice?: number;
        minPrice?: number;
        facets?: string[] | string;
    },
    keyword?: string;
    from?: number;
    to?: number;
}

interface ISearchResponse {
    facets: any[];
    docs: any[];
    sorts: any[];
}

export interface ISearchDao {
    searchByKeyword: (parms: ISearchParams) => Promise<ISearchResponse> ;
    autoComplete: (query: string) => Promise<Response>;
}

const SEARCH_FIELDS = ['Tag', 'Category', 'Address', 'Name'];

class SearchDao implements ISearchDao {

    private async getSearchByKeyword(body: any): Promise<IResponse> {
        const response = await doPost(ApiConstants.SEARCH_BY_KEYWORD, { body });
        return response.json();
    }

    public async searchByKeyword(params: ISearchParams = { filter : {} }): Promise<ISearchResponse> {
        const { filter: { maxPrice, minPrice, facets: selectedFacets}, keyword = '*', from = 0, to = 10 } = params;
        let filters = [];
        if(typeof selectedFacets === 'string') {
            const [column, value] = selectedFacets.split(':');
            filters.push({ match: { [column]: value } })
        } else {
            filters = selectedFacets ? selectedFacets.map(facet => {
                const [column, value] = facet.split(':');
                return {
                    match: { [column]: value }
                }
            }): [];
        }
        const searchBody = {
            'size': to,
            'query': {
                'bool': {
                    'must':{
                        'bool': {
                            should: filters,
                        }
                    },
                    'filter': [{
                            'multi_match': {
                                'query': keyword,
                                'fields': ['Tag', 'Name']
                            }
                        }
                    ]
                }
            },
            'aggregations': {
                'Category_Facets': {
                    'terms': {
                        'field': 'Category.keyword',
                        'size': to
                    }
                },
                'Address_Facets': {
                    'terms': {
                        'field': 'Address.keyword',
                        'size': to
                    }
                },
            }
        }
        if (maxPrice && minPrice) {
            const rangeFilter = {
                'range': {
                    'Price': {
                        'gte': minPrice,
                        'lte': maxPrice
                    }
                }
            };
            // @ts-ignore
            searchBody.query.bool.filter = [...searchBody.query.bool.filter, rangeFilter];
        }
        const data = await this.getSearchByKeyword(searchBody);
        if (!data || data.error) {
            return { facets: [], docs: [], sorts: [] };
        }
        const { hits: { hits }, aggregations: { Category_Facets: { buckets: categories = [] }, Address_Facets: { buckets: addresses = [] } } } = data;
        const categoriesFacets = categories.map(category => {
            const { key, doc_count: count } = category;
            return {
                value: `Category:${key}`,
                count,
            };
        });
        const addressFacets = addresses.map(category => {
            const { key, doc_count: count } = category;
            return {
                value: `Address : ${key}`,
                count,
            };
        });
        const facets = [{ name: 'Categories', value: categoriesFacets }, { name: 'Address', addressFacets }];
        const docs = hits.map((hit) => {
            const { _source, _score: score } = hit;
            return { ..._source, score };
        });
        return { facets, docs, sorts: [] };
    }

    public autoComplete(query: string): Promise<Response> {
        const body = {
            query: {
                'multi_match': {
                    query,
                    'fields': SEARCH_FIELDS,
                }
            }
        }
        return doPost(ApiConstants.AUTOCOMPLETE, { body });
    }
};


export default SearchDao;


