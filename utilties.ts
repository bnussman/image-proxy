export const DATA_DIRECTORY = import.meta.dir + '/data';

function millisecondsToDays(milliseconds: number) {
  return milliseconds / (1000 * 60 * 60 * 24);
}

export async function cleanUp() {
  console.log("Cleaning up", DATA_DIRECTORY + '/**/*');
  for (const fileName of new Bun.Glob(DATA_DIRECTORY + '/**/*').scanSync()) {
    const file = Bun.file(fileName);
    const fileAge = millisecondsToDays(Date.now() - file.lastModified);
    if (fileAge > 15) {
      console.log(fileName, "is", fileAge, "days old. Deleting it...")
      file.delete();
    }
  }
}
