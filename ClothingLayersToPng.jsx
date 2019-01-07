//http://absorbthenet.com/photoshopscripts/saveeachlayeraspng.jsx
//https://forums.adobe.com/thread/931920
//https://www.adobe.com/content/dam/acom/en/devnet/photoshop/scripting/Photoshop-CS6-JavaScript-Ref.pdf
#target photoshop   

var mainFolderPath = '';

var docRef = app.activeDocument
var allLayerSets = docRef.layerSets

main();
function main() {
  var wasCreated = promptAndCreateNewDestinationFolder();
  if(!wasCreated) {
    alert('The new folder at "' + mainFolderPath + '" was not created for some reason. Exiting the script.')
    return;
  }
  
  //this will go recursively through all folders and turn visibility to false for every layer
  processFoldersVisibility(docRef, false);

  //this is the main loop going through all sets of fabrics, cuts and trim colors
  loopThroughAllOptions(allLayerSets);
}

function loopThroughAllOptions(allLayerSets) {
  var trimColors = allLayerSets.getByName('trim colors').artLayers;
  var trimMasks = allLayerSets.getByName('trim masks').artLayers;
  var clothingOptions = allLayerSets.getByName('clothing options').artLayers;
  var fabricSwatches = allLayerSets.getByName('fabric swatches').artLayers;
  
  for(var i = 0; i < clothingOptions.length; i++) {
    var clothingOption = clothingOptions[i];
    clothingOption.visible = true;
    
    var matchingTrim = getMatchingTrim(trimMasks, clothingOption);
    
    var clothingFolderPath = mainFolderPath + '/' + clothingOption.name;
    var folderObject = new Folder(clothingFolderPath);
    folderObject.create();
    
    for(var k = 0; k < fabricSwatches.length; k++) {
      var fabric = fabricSwatches[k];
      fabric.visible = true;

      if(matchingTrim) {
        matchingTrim.visible = true;
        for(var z = 0; z < trimColors.length; z++) {
          var trimColor = trimColors[z];
    
          //in order for this color mask grouping to work correctly, we need to put the color layer
          //before the trim layer we want it applied to, then set grouped=true
          var dupedColor = trimColor.duplicate(matchingTrim, ElementPlacement.PLACEBEFORE );
          dupedColor.grouped = true;
          dupedColor.visible = true;
    
          saveCurrentStatus(clothingFolderPath + '/' +
                            fabric.name + '-' + trimColor.name + '-trim' +
                            '.png');	    
          dupedColor.grouped = false;
          dupedColor.remove();
        }
        matchingTrim.visible = false;
      } else {
        saveCurrentStatus(clothingFolderPath + '/' +
                fabric.name +
                '.png');
      }
      fabric.visible = false;
    }
    clothingOption.visible = false;
  }
}

function getMatchingTrim(trimMasks, clothingOption) {
  try {
    return trimMasks.getByName(clothingOption.name + ' trim');
  } catch(e) {
    return null;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////
function promptAndCreateNewDestinationFolder() {
  var folderName = prompt('What is the name of the new folder you want the pngs to be put inside of?', 'defaultName');
  
  //this is setting a global variable
  mainFolderPath = app.activeDocument.path + '/' + folderName;
  
  var folderObject = new Folder(mainFolderPath);
  return folderObject.create();
}
 
function saveCurrentStatus(newFilePathname) {
  var myPSPNGSaveOptions = new PNGSaveOptions();
  myPSPNGSaveOptions.compression = 0;
  docRef.saveAs(File(newFilePathname), myPSPNGSaveOptions, true, Extension.LOWERCASE);
}   


// ===============================================================================================	
// SETS EVERY FOLDER AND LAYERS VISIBILITY TO OFF TO START.
function processFoldersVisibility ( activeFolder, visibility ){
  if ( activeFolder.layerSets.length > 0 ) {
    for (var sf = 0; sf < activeFolder.layerSets.length; sf++){
      processFoldersVisibility ( activeFolder.layerSets[sf], visibility );
    }
  }
  processFilesVisibility( activeFolder, visibility );
}

function processFilesVisibility ( activeFolder, visibility ){
  // Process Each artLayer
  for (var a = 0; a < activeFolder.artLayers.length; a++){
    //alert(activeFolder.artLayers[a])
    activeFolder.artLayers[a].visible = visibility;
  }
}
// ENDS THE HANDLING OF THE FOLDERS AND LAYERS VISIBILITY
// =============================================================================