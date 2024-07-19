import dedent from "dedent";
import { SPARQLNeighborsRequest } from "../../types";
import { getFilters, getLimit, getSubjectClasses } from "./helpers";

/**
 * Generate a template with the same constraints that oneHopNeighborsTemplate
 * but returning only the blank node ID to be used as sub-query of another queries.
 *
 * @see oneHopNeighborsTemplate
 */
export default function oneHopNeighborsBlankNodesIdsTemplate({
  resourceURI,
  subjectClasses = [],
  filterCriteria = [],
  limit = 0,
  offset = 0,
}: SPARQLNeighborsRequest) {
  return dedent`
    # Sub-query to fetch blank node ids for one hop neighbors
    SELECT DISTINCT (?subject AS ?bNode) {
      BIND(<${resourceURI}> AS ?argument)
      ${getSubjectClasses(subjectClasses)}
      {
        ?argument ?pToSubject ?subject.
        ?subject a         ?subjectClass;
                 ?sPred    ?sValue .
        ${getFilters(filterCriteria)}
      }
      UNION
      {
        ?subject ?pFromSubject ?argument;
                 a         ?subjectClass;
                 ?sPred    ?sValue .
       ${getFilters(filterCriteria)}
      }
      FILTER(isBlank(?subject))
    }
    ${getLimit(limit, offset)}
  `;
}
