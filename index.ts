const DATA_DIRECTORY = import.meta.dir + '/data';

Bun.serve({
  async fetch(request) {
    const url = new URL(request.url);

    console.log("Got request for path", url.pathname);

    const cachedAsset = Bun.file(DATA_DIRECTORY + url.pathname);

    if (await cachedAsset.exists()) {
      console.log("Asset is cached. Serving asset from cache!");

      return new Response(await cachedAsset.bytes(), {
        headers: { "Content-Type": cachedAsset.type },
      });
    }

    console.log("Asset is not cached. Fetching it...");

    const asset = await fetch(`https://beep.us-east-1.linodeobjects.com/${url.pathname}`);

    if (asset.status === 200) {
      console.log("Got asset. Writing to disk...");
      await Bun.write(DATA_DIRECTORY + url.pathname, asset);
    }

    console.log("Serving newly cached asset!");

    return new Response(await Bun.file(DATA_DIRECTORY + url.pathname).bytes(), {
      headers: { "Content-Type": cachedAsset.type },
    });
  }
});