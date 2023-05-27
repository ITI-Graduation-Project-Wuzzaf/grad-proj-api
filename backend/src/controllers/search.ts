import { Request, Response } from 'express';
import { client } from '../utilities/elasticSearch';

interface ISearchQuery {
  index: string;
  body: {
    query: {
      bool: {
        should: { match_phrase_prefix: { title?: string; name?: string } }[];
        must: { match: { category: string } }[];
        minimum_should_match?: number;
      };
    };
    from: number;
    size: number;
  };
}

export const search = async (req: Request, res: Response) => {
  const query = req.body.query;
  const category = req.body.category;
  const page = Number(req.query.page) || 1;
  const size = Number(req.query.page) || 1;
  const from = (page - 1) * size;

  const searchQuery: ISearchQuery = {
    index: 'jobs',
    body: {
      query: {
        bool: {
          should: [],
          must: [],
        },
      },
      from,
      size,
    },
  };
  if (category) {
    searchQuery.body.query.bool.must.push({
      match: {
        category,
      },
    });
  }

  if (query) {
    searchQuery.body.query.bool.should.push(
      {
        match_phrase_prefix: {
          title: query,
        },
      },
      {
        match_phrase_prefix: {
          name: query,
        },
      },
    );
    searchQuery.body.query.bool.minimum_should_match = 1;
  }

  const result = await client.search<ISearchQuery>(searchQuery);
  console.log(result);

  res.send(result.hits.hits);
};

// export const autoComplete = (req:Request,res:Response)=>{};
