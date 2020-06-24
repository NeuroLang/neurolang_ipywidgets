# +
from neurolang_ipywidgets import NlPapayaViewer, PapayaNiftiImage
from ipywidgets import Layout

import nibabel as nib
# -

# ## Initialize papaya viewer

nl = NlPapayaViewer(layout=Layout(width="600px", height="530px", border="1px solid black"))
nl

# ## Add Overlay

papaya_image_overlay = PapayaNiftiImage(nib.load("img/overlay.nii"), dict(max=0.1))
nl.add([papaya_image_overlay])

# ## Display Color Bar

nl.color_bar = True

# ## Add Labels

# set config
config = dict(min=0, max=10, lut="Red Overlay")

papaya_image1 = PapayaNiftiImage(nib.load("img/L_G_front_sup.nii"), config)
nl.add([papaya_image1])

papaya_image2 = PapayaNiftiImage(nib.load("img/L_S_circular_insula_sup.nii"), config)
nl.add([papaya_image2])

papaya_image3 = PapayaNiftiImage(nib.load("img/R_S_circular_insula_sup.nii"), config)
papaya_image4 = PapayaNiftiImage(nib.load("img/R_G_front_inf-Opercular.nii"), config)
nl.add([papaya_image3, papaya_image4])

# ## Remove Label

nl.remove([papaya_image4])


