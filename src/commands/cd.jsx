import { useAppContext } from "../shared/AppContext";

const cd = (command) => {
    const { 
        currentPath, 
        setCurrentPath,
        currentDirectory,
        setCurrentDirectory
    } = useAppContext();


    const newDir = command.split(' ')[1]

    console.log('made it to appcontext cd')


    if (newDir === "..") {
        if (currentPath !== "/") {
          const pathArray = currentPath.split("/").filter(Boolean);
          pathArray.pop(); // Remove last directory
          const newPath = pathArray.length ? `/${pathArray.join("/")}` : "/";
          setCurrentPath(newPath);
          setCurrentDirectory(getDirectoryFromPath(newPath));
        } else {
          addOutput("Already at root directory.");
        }
      } else if (currentDirectory[newDir]) {
        const newPath = currentPath === "/" ? `/${newDir}` : `${currentPath}/${newDir}`;
        setCurrentPath(newPath);
        setCurrentDirectory(currentDirectory[newDir]);
      } else {
        addOutput(`No such directory: ${newDir}`);
      }
}

const getDirectoryFromPath = (path) => {
    const pathParts = path.split("/").filter(Boolean);
    let dir = fs;
    for (const part of pathParts) {
      dir = dir[part];
      if (!dir) return null;
    }
    return dir;
  };