import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';

import type { AxiosInstance } from 'axios';

import TheMovieDb from '@server/api/themoviedb';

function buildTmdb(): TheMovieDb {
  return new TheMovieDb({ discoverRegion: '', originalLanguage: '' });
}

function getAxios(tmdb: TheMovieDb): AxiosInstance {
  return (tmdb as unknown as { axios: AxiosInstance }).axios;
}

describe('TheMovieDb getDiscoverMovies', () => {
  afterEach(() => mock.restoreAll());

  it('uses primary release date sorting for upper-bound release date filters', async () => {
    const tmdb = buildTmdb();
    const get = mock.method(getAxios(tmdb), 'get', async () => ({
      data: { page: 1, results: [], total_pages: 1, total_results: 0 },
    }));

    await tmdb.getDiscoverMovies({
      sortBy: 'release_date.desc',
      primaryReleaseDateLte: '2026-12-31',
    });

    assert.strictEqual(get.mock.callCount(), 1);
    assert.strictEqual(
      get.mock.calls[0].arguments[1]?.params?.sort_by,
      'primary_release_date.desc'
    );
  });

  it('keeps release date sorting for explicit release date ranges', async () => {
    const tmdb = buildTmdb();
    const get = mock.method(getAxios(tmdb), 'get', async () => ({
      data: { page: 1, results: [], total_pages: 1, total_results: 0 },
    }));

    await tmdb.getDiscoverMovies({
      sortBy: 'release_date.desc',
      primaryReleaseDateGte: '2026-01-01',
      primaryReleaseDateLte: '2026-12-31',
    });

    assert.strictEqual(get.mock.callCount(), 1);
    assert.strictEqual(
      get.mock.calls[0].arguments[1]?.params?.sort_by,
      'release_date.desc'
    );
  });
});
