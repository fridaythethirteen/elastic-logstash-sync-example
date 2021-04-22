

const BASE_API = 'http://elasticsearch:9200/resturant'

export default {
   SEARCH_BY_KEYWORD: `${BASE_API}/_search?pretty`,
   AUTOCOMPLETE: `${BASE_API}/_search?pretty`,
};
