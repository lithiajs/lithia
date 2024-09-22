export interface Runner {
  envFileNames: string[];
  environment: 'development' | 'production';
}
