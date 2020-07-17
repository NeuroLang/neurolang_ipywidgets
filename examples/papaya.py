# +
from neurolang_ipywidgets import NlPapayaViewer, PapayaNiftiImage
from ipywidgets import Layout

import nibabel as nib
# -

# ## Initialize papaya viewer

nl = NlPapayaViewer(layout=Layout(width="500px", height="470px"))
nl

# ## Add Overlay

papaya_image_overlay = PapayaNiftiImage(nib.load("img/overlay.nii"), dict(max=0.1))
nl.add([papaya_image_overlay])

# ## Set Color Bar by Image Index

# 0 is index for atlas
nl.show_image_colorbar_at_index(0)

# ## Hide/Show Color Bar

nl.colorbar = False

nl.colorbar = True

# ## Add Labels

papaya_image1 = PapayaNiftiImage(nib.load("img/L_G_front_sup.nii"))
nl.add([papaya_image1])

papaya_image2 = PapayaNiftiImage(nib.load("img/L_S_circular_insula_sup.nii"))
nl.add([papaya_image2])

papaya_image3 = PapayaNiftiImage(nib.load("img/R_S_circular_insula_sup.nii"))
papaya_image4 = PapayaNiftiImage(nib.load("img/R_G_front_inf-Opercular.nii"))
nl.add([papaya_image3, papaya_image4])

# ## Remove Label

nl.remove([papaya_image4])

# ## Set Color Bar by Image

nl.show_image_colorbar(papaya_image1)

# ## Reset viewer

nl.reset()


