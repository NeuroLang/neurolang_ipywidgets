# +
from ipywidgets import BoundedFloatText, BoundedIntText, Button, Checkbox, Dropdown, FloatSlider, HBox, Layout

from neurolang_ipywidgets import NlVBoxOverlay

# +
config = dict()

lut_options = [
    "Grayscale",
    "Red Overlay",
    "Green Overlay",
    "Blue Overlay",
    "Gold",
    "Spectrum",
    "Overlay (Positives)",
    "Overlay (Negatives)",
]

alpha = FloatSlider(
    value=config.get("alpha", 1),
    min=0,
    max=1.0,
    step=0.1,
    description="alpha:",
    description_tooltip="Overlay image alpha level (0 to 1).",
    disabled=False,
    continuous_update=False,
    orientation="horizontal",
    readout=True,
    readout_format=".1f"
)

lut = Dropdown(
    options=lut_options,
    value=config.get("lut", "Red Overlay"),
    description="lut:",
    description_tooltip="The color table name."
)

nlut = Dropdown(
    options=lut_options,
    value=config.get("lut", "Red Overlay"),
    description="negative-lut:",
    description_tooltip="The color table name used by the negative side of the parametric pair.",
)

min = BoundedFloatText(
    value=config.get("min", None),
    description="min:",
    description_tooltip="The display range minimum.",
    disabled=False,
)

minp = BoundedIntText(
    value=config.get("minPercent", None),
    min=0,
    max=100,
    step=1,
    description="min %:",
    description_tooltip="The display range minimum as a percentage of image max.",
    disabled=False,
)

max = BoundedFloatText(
    value=config.get("max", None),
    description="max:",
    description_tooltip="The display range maximum.",
    disabled=False,
)

maxp = BoundedIntText(
    value=config.get("maxPercent", None),
    min=0,
    max=100,
    step=1,
    description="max %:",
    description_tooltip="The display range minimum as a percentage of image max.",
    disabled=False,
)

sym = Checkbox(
    value=False,
    description="symmetric",
    description_tooltip="When selected, sets the negative range of a parametric pair to the same size as the positive range.",
    disabled=False,
)

# +
vb_layout = Layout(width="400px")
hb_sub_layout = Layout(width="350px", display="flex", flex_flow="row", align_content="flex-start")

vb = NlVBoxOverlay([
            alpha,
            lut,
            nlut,
            HBox([min, minp], 
#                 layout=hb_sub_layout
                ),
            HBox([max, maxp], 
#                 layout = hb_sub_layout
                ),
            sym]
        )
#vb.layout = vb_layout
vb
# -

min.keys

min.style.keys


