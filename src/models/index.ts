export enum runtime {
  ELECTRON = 'ELECTRON',
  NODE = 'NODE',
  NWJS = 'NWJS'
}
export type target = string
export type abi = number

export interface options {
  includeIntermediates?: boolean,
  includeNightly?: boolean,
  includeBeta?: boolean,
  includeReleaseCandidates?: boolean
}

export interface runtimeMatcher {
  url: string,
  matcher: (versions: unknown) => moduleInfos[]
}

export interface electronVersion {
  node_id: string;
  tag_name: string;
  name: string;
  prerelease: boolean;
  published_at: string;
  version: string;
  npm_package_name: string;
  deps: {
    node: string;
    v8: string;
    uv: string;
    zlib: string;
    openssl: string;
    modules: string;
    chrome: string;
  };
  npm_dist_tags: string[];
  total_downloads: number;
}
export interface nodeVersion {
  version: string;
  date: string;
  files: string[];
  npm: string;
  v8: string;
  uv: string;
  zlib: string;
  openssl: string;
  modules: string;
  lts: boolean;
  security: boolean;
}

export interface nwjsVersion {
  version: string;
  files: string[];
  flavors: string[];
  components: {
    node: string;
    chromium: string;
  };
}

export interface moduleInfos {
  type: runtime,
  target: target,
  abi: abi
}
