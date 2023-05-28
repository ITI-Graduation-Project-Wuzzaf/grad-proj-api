import { Request, Response } from 'express';

import { client } from '../utilities/elasticSearch';
import { searchSchema } from '../utilities/validation/search';
import { RequestValidationError } from '../errors/requestValidationError';

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
  const { error } = searchSchema.validate(req.query);
  if (error) {
    throw new RequestValidationError(error);
  }
  console.log(req.query);

  const query = req.query.query as string | undefined;
  const category = req.query.category as string | undefined;
  const page = Number(req.query.page) || 1;
  const size = Number(req.query.size) || 6;
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
    console.log(category);

    searchQuery.body.query.bool.must.push({
      match: {
        category,
      },
    });
  }

  if (query) {
    console.log(query);

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

  res.send(result.hits.hits);
};

// export const autoComplete = (req:Request,res:Response)=>{};
