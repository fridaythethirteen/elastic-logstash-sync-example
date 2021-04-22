import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { ParamsDictionary } from 'express-serve-static-core';

import SearchDao, { IResponse, ISearchParams } from '@daos/Search/SearchDao';
import { paramMissingError } from '@shared/constants';

// Init shared
const router = Router();
const searchDao = new SearchDao();


/******************************************************************************
 *                    Autocomplete API - "GET /api/search/autocomplete:query"
 ******************************************************************************/

router.get('/autocomplete/:query', async (req: Request, res: Response) => {
    const { query } = req.params as ParamsDictionary;
    const response = await searchDao.autoComplete(query);
    const data: IResponse = await response.json();
    const { hits: { hits = [] } } = data;
    const autocomplete = hits.map((hit) => {
        const { _score: score, _source: { Category, Name, Address } } = hit;
        return {
            score,
            Category,
            Name,
            Address,
        };
    });
    return res.status(OK).json(autocomplete);
});

/******************************************************************************
 *                    Autocomplete API - "GET /api/search/autocomplete:query"
 ******************************************************************************/

router.get('/:query', async (req: Request, res: Response) => {
    const { query } = req.params as ParamsDictionary;
    const { facets, from, to, maxPrice, minPrice } = req.query as unknown as { facets: string[] | string; from: number; to: number; maxPrice: number; minPrice: number };
    const searchData = await searchDao.searchByKeyword({ filter: {
        maxPrice,
        minPrice,
        facets,
    }, from, to, keyword: query});
    return res.status(OK).json(searchData);
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/

export default router;
