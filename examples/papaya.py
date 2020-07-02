# +
from neurolang_ipywidgets import NlPapayaViewer, PapayaNiftiImage
from ipywidgets import Layout

import nibabel as nib
# -

# ## Initialize papaya viewer

nl = NlPapayaViewer(layout=Layout(width="800px", height="700px"))
nl

# ## Display Color Bar

nl.colorbar = True

# ## Add Overlay

papaya_image_overlay = PapayaNiftiImage(nib.load("img/overlay.nii"), dict(max=0.1))
nl.add([papaya_image_overlay])

# ## Set Color Bar by Image Index

# 0 is index for atlas
nl.show_image_colorbar_at_index(0)

# ## Add Labels

# set config
config_green = dict(min=0, max=10, lut="Green Overlay")
config_blue = dict(min=0, max=10, lut="Blue Overlay")
config_gold = dict(min=0, max=10, lut="Gold")
config_fire = dict(min=0, max=10, lut="Fire")

papaya_image1 = PapayaNiftiImage(nib.load("img/L_G_front_sup.nii"), config_green)
nl.add([papaya_image1])

papaya_image2 = PapayaNiftiImage(nib.load("img/L_S_circular_insula_sup.nii"), config_blue)
nl.add([papaya_image2])

papaya_image3 = PapayaNiftiImage(nib.load("img/R_S_circular_insula_sup.nii"), config_gold)
papaya_image4 = PapayaNiftiImage(nib.load("img/R_G_front_inf-Opercular.nii"), config_fire)
nl.add([papaya_image3, papaya_image4])

# ## Remove Label

nl.remove([papaya_image4])

# ## Set Color Bar by Image

nl.show_image_colorbar(papaya_image1)

# ## Reset viewer

nl.reset()
