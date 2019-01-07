# photoshopScripts

A repo for any photoshop scripts

The .jsx files are NOT the modern jsx, it is an extension that photoshop has been using for quite some time.  
[Photoshop scripting docs](https://www.adobe.com/devnet/photoshop/scripting.html)


## ClothingLayersToPng.jsx
This script goes through and chooses 1 layer from a folder called "clothing options"
forEach "clothing options" and forEach "fabric swatches" check if there is a matching trim in "trim masks".
  If so, iterate over each of the "trim colors" and output a png.
  If not, just output a png with the clothing option and fabric


### Attribution
I started from these scripts and utilized a lot of what they were doing. Thank you very much for your help

- http://absorbthenet.com/photoshopscripts/saveeachlayeraspng.jsx  
- https://forums.adobe.com/thread/931920  
- https://www.adobe.com/content/dam/acom/en/devnet/photoshop/scripting/Photoshop-CS6-JavaScript-Ref.pdf  
