# Lithia.js

## 2.0.6

### Patch Changes

#### Fixed

- Now correctly handle routes when using `Windows` OS

## 2.0.5

### Patch Changes

#### Fixed

- Resolved build process issue where route directories weren't generated when no `.ts` files existed outside route folders in `routesDir`

#### Added

- New `start` command for production environment execution

## 2.0.4

### Patch Changes

#### Fixed

- Status code now correctly set when using `LithiaResponse.status` method

## 2.0.3

### Patch Changes

#### Fixed

- Application now correctly restarts when `lithia.config.js` is modified when running in development mode

## 2.0.2

### Patch Changes

#### Fixed

- Fixed dynamic parameters retrieval
- Fixed QueryParser middleware

#### Added

- Added HTTP error handling support
