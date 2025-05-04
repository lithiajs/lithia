export type MatchedMethodSuffix = 'delete' | 'get' | 'head' | 'options' | 'patch' | 'post' | 'put' | 'trace';

export type MatchedEnvSuffix = 'dev' | 'prod';

export type RouteMetadata = {};

export type Route = {
  method?: MatchedMethodSuffix;
  env?: MatchedEnvSuffix;
  path: string;
  dynamic: boolean;
  filePath: string;
  regex: string;
};
