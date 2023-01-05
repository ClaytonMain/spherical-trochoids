# Spherical Trochoids

An interactive web app for experimenting with spherical epitrochoids and hypotrochoids! Please note: This project is still under development and is currently best-viewed on desktop rather than mobile.

## Usage

### Camera

- Left-click & drag within the canvas to move the camera around the central sphere.
- Use the scroll wheel to zoom the camera in and out.

### Control Panel

Hover over the row labels within the control panel to view a brief description of what that row controls. Alternatively, see below:

- Animation
  - Curve
    - `t`: The current value of `t` for the displayed curve.
    - `Animate`: Check to animate the curve, uncheck to pause the curve animation (basically a play / pause button).
    - `Speed`: The speed at which `t` in incremented (playback speed). Does nothing when `Animate` is unchecked.
  - Camera
    - `Rotate`: Check to auto-rotate the camera around the central sphere. Uncheck to disable auto-rotate.
    - `Speed`: The speed at which to rotate the camera. Use a negative value to rotate in the opposite direction. Does nothing when `Rotate` is unchecked.
- Parameters
  - Current Parameters (Display-Only)
    - This section displays the parameters used to calculate the curve currently displayed in the canvas.
  - Input
    - `Theta`: A function with respect to the variable `t` controlling the angle of rotation within the XZ plane.
    - `Phi`: A function with respect to the variable `t` controlling the angle of rotation within the XY plane.
    - `R`: The radius of the central sphere.
    - `r`: The radius of the circle rolling on the central sphere. Setting this to a negative value will cause the circle to roll inside of the central sphere.
    - `d = r`: Forces `d` to equal `r`. Input for `d` is disabled while this is checked. Also forces the randomization function to keep `d` equal to `r`.
    - `d`: The distance from the center of the circle to the point from which the curve is drawn.
    - `Start`: The start / minimum value for `t`. Also used in the randomization function. **Warning**: Increasing the distance between the start and end values and / or setting a very small step size can negatively impact performance and possibly cause your browser to run slowly or crash.
    - `End`: The end / maximum value for `t`. Also used in the randomization function. **Warning**: Increasing the distance between the start and end values and / or setting a very small step size can negatively impact performance and possibly cause your browser to run slowly or crash.
    - `Step`: The step value used when calculating the curve. A smaller value will result in a smoother curve (usually), but at the cost of performance. Also used in the randomization function. **Warning**: Increasing the distance between the start and end values and / or setting a very small step size can negatively impact performance and possibly cause your browser to run slowly or crash.
    - `Submit`: Click this button to calculate and display the curve using the provided input values. **Please note**: There currently is no indicator to let you know when the calculations are running. On slower machines, it may appear as though the app has frozen after clicking this button, especially if the `Start` and `End` values are far apart or if the `Step` value is very small. Please allow time for the calculations to finish.
  - `Randomize`: Click this button to semi-randomize the values used to calculate the curve. Only semi-randomizes the `Theta`, `Phi`, `R`, `r`, and `d` values. Will force `d` equal to `r` if `d = r` is checked. **Please note**: There currently is no indicator to let you know when the calculations are running. On slower machines, it may appear as though the app has frozen after clicking this button, especially if the `Start` and `End` values are far apart or if the `Step` value is very small. Please allow time for the calculations to finish.
  - `Auto Randomize`: Automatically generates a semi-randomized curve once the `t` value within "Animation > Curve" reaches its maximum value.
- Style
  - Use the style controls within this section to change the appearances of the elements within the canvas.

## About

I originally derived the formulae to describe spherical epitrochoids and hypotrochoids after being unable to find any such formulae online. As far as I can tell, I'm the first person to derive such formulae, but _please_ let me know if you discover an example of such formulae existing prior to 2014!

I tried to publish the formulae describing these curves shortly after deriving them, but the journal to which I had submitted my paper rejected it for reasons I don't fully recall. Eventually, I sort of lost steam on the project while rewriting the paper for publication to a different journal, and I ended up not doing anything with it for several years. If you're interested in reading the paper I tried to publish, you can find it in this repo.

Recently, I decided I probably ought to do something with these formulae soon before someone else came along and derived the formulae themselves. I really didn't want to bother dealing with academic journals again, so I figured I'd try doing something fun with it and this is where it ended up!

I'd never worked with React before this project, and honestly, it's pretty confusing. I'm certain there's a lot of stuff in the code that could be improved (and I'm about 90% sure I've got a memory leak somewhere), but I'm finally at a point where I feel comfortable sharing this project with others.

## Planned Improvements

- [ ] Find and fix the probable memory leak
- [ ] Make more mobile-friendly
- [ ] Add parameter history to keep track of the parameters used for the last several curves
- [ ] Add in some interactive visuals to indicate what each parameter does
- [ ] Improve the existing keyboard shortcuts
- [ ] Add more keyboard shortcuts
- [ ] Improve the curve-randomization function
- [ ] Add randomization configuration options
- [ ] Add style presets
- [ ] Allow curve parameters to be pushed to / read from the URL to make sharing curves easier
- [ ] Derive formulae to describe the curve generated by rolling a _sphere_ on the surface of the central sphere, then make that an option here
