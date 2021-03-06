// Generated by CoffeeScript 1.8.0
var fs, icons, log, path;

fs = require('fs');

path = require('path');

log = require('printit')({
  prefix: 'icons'
});

module.exports = icons = {};


/*
Get right icon path depending on app configuration:
* returns root folder + path mentioned in the manifest file if path is in the
  manifest.
* returns svg path if svg icon exists in the app folder.
* returns png path if png icon exists in the app folder.
* returns null otherwise
 */

icons.getPath = function(root, appli) {
  var basePath, extension, homeBasePath, iconPath, pngPath, result, svgPath;
  iconPath = null;
  if ((appli.iconPath != null) && fs.existsSync(path.join(root, appli.iconPath))) {
    iconPath = path.join(root, appli.iconPath);
    if (!fs.existsSync(iconPath)) {
      iconPath = null;
    }
  }
  if ((iconPath == null) && (appli.icon != null)) {
    homeBasePath = path.join(process.cwd(), 'client/app/assets');
    iconPath = path.join(homeBasePath, appli.icon);
    if (!fs.existsSync(iconPath)) {
      iconPath = null;
    }
  }
  if (iconPath == null) {
    basePath = path.join(root, "client", "app", "assets", "icons");
    svgPath = path.join(basePath, "main_icon.svg");
    pngPath = path.join(basePath, "main_icon.png");
    if (fs.existsSync(svgPath)) {
      iconPath = svgPath;
    } else if (fs.existsSync(pngPath)) {
      iconPath = pngPath;
    } else {
      iconPath = null;
    }
  }
  if (iconPath == null) {
    return null;
  } else {
    extension = iconPath.indexOf('.svg') !== -1 ? 'svg' : 'png';
    result = {
      path: iconPath,
      extension: extension
    };
    return result;
  }
};

icons.getIconInfos = function(appli) {
  var basePath, iconInfos, name, repoName, root;
  if (appli != null) {
    repoName = (appli.git.split('/')[4]).replace('.git', '');
    name = appli.name.toLowerCase();
    basePath = '/' + path.join('usr', 'local', 'cozy', 'apps');
    root = path.join(basePath, name, name, repoName);
    if (!fs.existsSync(root)) {
      root = path.join(basePath, name);
    }
    iconInfos = icons.getPath(root, appli);
    if (iconInfos != null) {
      return iconInfos;
    } else {
      throw new Error("Icon not found");
    }
  } else {
    throw new Error('Appli cannot be reached');
  }
};

icons.save = function(appli, iconInfos, callback) {
  var iconStr, name;
  if (callback == null) {
    callback = function() {};
  }
  if (iconInfos != null) {
    iconStr = JSON.stringify(iconInfos);
    log.debug("Icon to save for app " + appli.slug + ": " + iconStr);
    name = "icon." + iconInfos.extension;
    return appli.attachFile(iconInfos.path, {
      name: name
    }, function(err) {
      if (err) {
        return callback(err);
      } else {
        return callback();
      }
    });
  } else {
    return callback(new Error('icon information not found'));
  }
};
