# Refraction Analysing Software
This piece of software was created for the GiLASat team's secondary mission which was part of their participation in the 2016 CanSat competition.

## Introduction
In our secondary mission, we measure the intensity of atmospheric refraction, the phenomenon of light rays bending as they travel across the atmosphere. In our analysis, we assume that:
* The refractive index of air at any point can be determined by the equation:
**`n = C*P/T`**
where _C_ is a known constant.
*	The pressure of air at height *H* is constant.
*	The same is true for temperature at height *H*.

With said assumptions made, we attempt to determine the path of a light ray running through the atmosphere at a certain angle from a certain height, to see whether it could create a false image, much like the mirages observed on roads during hot days.

The program we use for simulating the path utilises data on pressure and temperature at different heights. Its operation can be described in the following way:

1.	Turning an array of data points about pressure and temperature at certain heights into an approximate, but continuous function.

  Any two points can be connected by a line, and the coordinates of said points can be used to determine the function describing aforementioned line. The function can in turn be used to determine the value of *Y* for any given *X*. Our program assumes that pressure between two data points changes in a linear way,  and finds the function describing a line that connects points _P<sub>n</sub>_ and _P<sub>n+1</sub>_. A function describing a line takes the form of **`f(x) = ax + b`**, and can be determined by solving two equations for a and b, which yield the following universal equations for determining a line function using two known points:
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
  
  *  sin⁡*α* / sin*⁡β* = n<sub>1</sub> / n<sub>2</sub>
  
  or
  
  *  β = arcsin⁡(n<sub>n</sub><sup>2</sup> / n<sub>n+1</sub> * sin*α*)

4.	Knowing that a light ray travels a meter at a certain angle before refracting, we conclude that distance travelled horizontally between two adjacent refractions is equal to
 `d = 1m * tan⁡*α*` .

5.	Using the aforementioned calculations, we determine the position of the ray at various heights, separated by a meter, thus approximating its path.

## Program usage

To run the program you have to use node.js. You can download it [here](https://nodejs.org/en/download/).

### Data format
  
Data should be placed in a *.txt file. Each line of the file have to contain (in the following order):
  * height(in meters),
  * pressure(in Pascal's),
  * temperature(in Celsius degrees)
  
divided by a single space.

Records had to be sorted by the height value (from the lowest value).
  
An example a correct dataset:
>2.84929123898 101295.516369 15.097044793
  
>14.2020115687 101164.536999 14.7184390036
  
>25.5547318984 101038.97901 14.9812686216
  
>36.9074522281 100868.171518 14.0979884198
  
>48.2601725579 100712.013515 15.0572069656
  
>59.6128928876 100637.413782 14.0790090275
  
>70.9656132173 100488.580001 14.8283974694
  
>82.318333547 100348.318971 14.075228432
  
>93.6710538767 100210.397017 14.7188872509
  
>105.023774206 100092.022043 14.9430260532
  
>116.376494536 99941.9585085 14.8726214426
  
>127.729214866 99775.4236311 13.8541470468
  
### Running the program
To use the program you have to run script app.js via node with the following arguments:
* [input_file] - name of the input file, eg.: dataset1.txt, data/dataset1.txt;
* [output_file] - name of the output file, notice that it have to be in the same folder as the app.js, eg.: results1.txt but not results/result1.txt!;
* [start_height] - the height on which the analysis will start;
* [analysis_step] (default set on 100) - distance between succeeding points of the analysis.
 
An exemplary program running with data in file data.txt:

`node app.js data.txt result.txt 3000 50`

`node app.js data/refraction1.txt result1.txt 2500`
