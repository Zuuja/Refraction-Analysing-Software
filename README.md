# Refraction Analysing Software
This pice of software was created for the GiLASat team's secondary mission which was part of their participation in the 2016 CanSat competition.

## Inroduction
In our secondary mission, we measure the intensity of atmospheric refraction, the phenomenon of light rays bending as they travel across the atmosphere. In our analysis, we assume that:
* The refractive index of air at any point can be determined by the equation:
**`n = C*P/T`**
where _C_ is a known constant.
*	The pressure of air at height H is constant.
*	The same is true for temperature at height H.

With said assumptions made, we attempt to determine the path of a light ray running through the atmosphere at a certain angle from a certain height, to see whether it could create a false image, much like the mirages observed on roads during hot days.

The program we use for simulating the path utilises data on pressure and temperature at different heights. Its operation can be described in the following way:

1.	Turning an array of data points about pressure and temperature at certain heights into an approximate, but continuous function.

  Any two points can be connected by a line, and the coordinates of said points can be used to determine the function describing aforementioned line. The function can in turn be used to determine the value of Y for any given X. Our program assumes that pressure between two data points changes in a linear way,  and finds the function describing a line that connects points _P<sub>n</sub>_ and _P<sub>n+1</sub>_. A function describing a line takes the form of **`f(x) = ax + b`**, and can be determined by solving two equations for a and b, which yield the following universal equations for determining a line function using two known points:
    *  a = (Y<sub>1</sub> - Y<sub>2</sub>) / (X<sub>1</sub> - X<sub>2</sub>)
    *  b = Y<sub>1</sub> - (a * X<sub>1</sub>)
  
  We then determine _a_ with the equation:
    * a = (P<sub>n</sub> - P<sub>n+1</sub>) / (H<sub>n</sub> - H<sub>n+1</sub>)
    
  to then determine b using:
    * b = P<sub>n</sub> - (a * H<sub>n</sub>)
    
  thus being able to determine pressure not only at precisely the points where the data was collected, but at any point in the area where our measurements were conducted. An analogous procedure is then done to the temperature data.

2.	Using the equation **`n = C*P/T`** with the data on pressure and temperature as a function of height, we determine the refraction index as a function of height.

3.	We assume that there are infinite surfaces parallel to the ground, such that:
 *	for all points on a given surface the refraction index is constant;
 *	the surfaces are separated by a meter;
 *	for all points laying less than a meter below the surface, the refraction index is constant and equal to that of any point on said surface.

  From those assumptions it can be concluded that a light ray running through the atmosphere would only refract once it travels a meter vertically, and said refraction can be described by Snell’s law in the following way:
  
  *  sin⁡α / sin⁡β = n<sub>1</sub> / n<sub>2</sub>
  
  or
  
  *  β = arcsin⁡(n<sub>n</sub> * n<sub>n</sub> / n<sub>n+1</sub> * sin *α*)

4.	Knowing that a light ray travels a meter at a certain angle before refracting, we conclude that distance travelled horizontally between two adjacent refractions is equal to
 d=1m*tan⁡α .

5.	Using the aforementioned calculations, we determine the position of the ray at various heights, separated by a meter, thus approximating its path.

