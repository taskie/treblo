import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { uria } from "@/utils/uri";
import { defaultInstance } from "@/api/apiClient";
import { applicationName } from "@/config";
import { GetStatResponse } from "@/api/types";
import Stat from "@/components/Stat";
import FootprintView from "@/components/Footprint";
import HistoryGroup from "@/components/HistoryGroup";
import StatGroup from "@/components/StatGroup";
import GlobalNav from "@/components/GlobalNav";
import GroupLink from "@/components/GroupLink";

type Query = {
  workspaceName: string;
  groupName: string;
  path: string[];
};

type Response = GetStatResponse;

type Props = { response?: Response; err?: string };

const ResponseView: React.FC<{ response: Response; workspaceName: string; groupName: string }> = ({
  response: { stat, histories, footprints, eq_stats },
  workspaceName,
  groupName,
}) => {
  const footprint = footprints != null ? footprints["" + stat.footprint_id] : undefined;
  return (
    <>
      <h2>Stat</h2>
      <Stat workspaceName={workspaceName} groupName={groupName} stat={stat} />
      {stat.path.includes("/")
        ? (() => {
            const splitted = stat.path.split("/");
            splitted.pop();
            const path_prefix = splitted.join("/");
            return (
              <GroupLink workspaceName={workspaceName} groupName={groupName} query={{ path_prefix }}>
                <a>
                  Group: {groupName} (Path Prefix: {path_prefix})
                </a>
              </GroupLink>
            );
          })()
        : undefined}
      {histories != null ? (
        <>
          <h2>Histories</h2>
          <HistoryGroup workspaceName={workspaceName} groupName={groupName} histories={histories} />
        </>
      ) : undefined}
      {footprint != null ? (
        <>
          <h2>Footprint</h2>
          <FootprintView workspaceName={workspaceName} footprint={footprint} />
        </>
      ) : undefined}
      {eq_stats != null ? (
        <>
          <h2>Same Stats</h2>
          <StatGroup
            workspaceName={workspaceName}
            groupName={groupName}
            stats={eq_stats}
            diffSource={{ groupName, pathPrefix: stat.path }}
          />
        </>
      ) : undefined}
    </>
  );
};

export const StatPage: NextPage<Props> = (props) => {
  const router = useRouter();
  const { query: rawQuery } = router;
  const { workspaceName, groupName, path: statPath } = (rawQuery as unknown) as Query;
  const pageTitle = `Stat: ${statPath.join("/")}`;
  return (
    <div className="container">
      <Head>
        <title>
          {pageTitle} - {applicationName}
        </title>
      </Head>
      <GlobalNav workspaceName={workspaceName} groupName={groupName} />
      <h1>{pageTitle}</h1>
      {props.response != null ? (
        <ResponseView response={props.response} workspaceName={workspaceName} groupName={groupName} />
      ) : (
        <p>Some error occured: {props.err}</p>
      )}
    </div>
  );
};

StatPage.getInitialProps = async ({ query: rawQuery }) => {
  try {
    const { workspaceName, groupName, path: statPath } = (rawQuery as unknown) as Query;
    const path = uria`${workspaceName}/stats/${groupName}/` + statPath.map((s) => encodeURIComponent(s)).join("/");
    const { data } = await defaultInstance.get(path);
    return { response: data };
  } catch (err) {
    // console.error(err);
    return { err: err.message };
  }
};

export default StatPage;
