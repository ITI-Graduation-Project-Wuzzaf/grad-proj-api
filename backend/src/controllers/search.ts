import { Request, Response } from 'express';
import { client } from '../utilities/elasticSearch';

interface ISearchQuery {
  index: string;
  body: {
    query: {
      bool: {
        should: { match_phrase_prefix: { title?: string; name?: string } }[];
        must: { term: { category: string } }[];
      };
    };
  };
}
export const search = async (req: Request, res: Response) => {
  const query = req.body.query;
  const category = req.body.category;

  const searchQuery: ISearchQuery = {
    index: 'jobs',
    body: {
      query: {
        bool: {
          should: [],
          must: [],
        },
      },
    },
  };
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
  }
  if (category) {
    searchQuery.body.query.bool.must.push({
      term: {
        category,
      },
    });
  }

  const result = await client.search<ISearchQuery>(searchQuery);
  console.log(result);

  res.send(result);
};

// export const autoComplete = (req:Request,res:Response)=>{};
