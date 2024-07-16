import { Vertex } from "../../../@types/entities";
import type {
  ErrorResponse,
  KeywordSearchRequest,
  KeywordSearchResponse,
} from "../../useGEFetchTypes";
import isErrorResponse from "../../utils/isErrorResponse";
import mapApiVertex from "../mappers/mapApiVertex";
import keywordSearchTemplate from "../templates/keywordSearchTemplate";
import type { OCVertex } from "../types";
import { OpenCypherFetch } from "../types";

type RawKeySearchResponse = {
  results: [
    {
      object: OCVertex;
    },
  ];
};

const keywordSearch = async (
  openCypherFetch: OpenCypherFetch,
  req: KeywordSearchRequest
): Promise<KeywordSearchResponse> => {
  const vertices = await vertexKeywordSearch(openCypherFetch, req);

  return { vertices: vertices };
};

const vertexKeywordSearch = async (
  openCypherFetch: OpenCypherFetch,
  req: KeywordSearchRequest
): Promise<Vertex[]> => {
  const openCypherTemplate = keywordSearchTemplate(req);
  const data = await openCypherFetch<RawKeySearchResponse | ErrorResponse>(
    openCypherTemplate
  );

  if (isErrorResponse(data)) {
    throw new Error(data.detailedMessage);
  }

  return data.results.map(value => mapApiVertex(value.object));
};

export default keywordSearch;
