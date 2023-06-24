"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.candidateSearch = exports.search = void 0;
const crud = __importStar(require("../utilities/crud"));
const search_1 = require("../utilities/validation/search");
const requestValidationError_1 = require("../errors/requestValidationError");
const BadRequestError_1 = require("../errors/BadRequestError");
// import { client } from '../utilities/elasticSearch';
// interface ISearchQuery {
//   index: string;
//   body: {
//     query: {
//       bool: {
//         should: { match_phrase_prefix: { title?: string; name?: string } }[];
//         must: { match: { category: string } }[];
//         minimum_should_match?: number;
//       };
//     };
//     from: number;
//     size: number;
//   };
// }
// export const search = async (req: Request, res: Response) => {
//   const { error } = searchSchema.validate(req.query);
//   if (error) {
//     throw new RequestValidationError(error);
//   }
//   console.log(req.query);
//   const query = req.query.query as string | undefined;
//   const category = req.query.category as string | undefined;
//   const page = Number(req.query.page) || 1;
//   const size = Number(req.query.size) || 6;
//   const from = (page - 1) * size;
//   const searchQuery: ISearchQuery = {
//     index: 'jobs',
//     body: {
//       query: {
//         bool: {
//           should: [],
//           must: [],
//         },
//       },
//       from,
//       size,
//     },
//   };
//   if (category) {
//     searchQuery.body.query.bool.must.push({
//       match: {
//         category,
//       },
//     });
//   }
//   if (query) {
//     searchQuery.body.query.bool.should.push(
//       {
//         match_phrase_prefix: {
//           title: query,
//         },
//       },
//       {
//         match_phrase_prefix: {
//           name: query,
//         },
//       },
//     );
//     searchQuery.body.query.bool.minimum_should_match = 1;
//   }
//   const result = await client.search<ISearchQuery>(searchQuery);
//   res.send(result.hits.hits);
// };
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = search_1.searchSchema.validate(req.query);
    if (error) {
        throw new requestValidationError_1.RequestValidationError(error);
    }
    const query = req.query.q;
    const category = req.query.cate;
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.size) || 4;
    const { pagination, jobs } = yield crud.search(page, perPage, res.locals.userId, query, category);
    res.send({ pagination, jobs });
});
exports.search = search;
const candidateSearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = search_1.searchSchema.validate(req.query);
    if (error) {
        throw new requestValidationError_1.RequestValidationError(error);
    }
    if (!req.query.q) {
        throw new BadRequestError_1.BadRequestError('Must pass params (q)');
    }
    const query = req.query.q;
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.size) || 6;
    const { pagination, candidates } = yield crud.candidateSearch(page, perPage, query);
    res.send({ pagination, candidates });
});
exports.candidateSearch = candidateSearch;
