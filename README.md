# Reinforced.Lattice
Remote data representation framework for .NET.

Please post your questions to StackOverflow with tag [**reinforced-lattice**](http://stackoverflow.com/questions/tagged/reinforced-lattice). Please do not open post issues here - all github issues to this project from non-contributors *will not* be considered and most likely I will close them immediately.

## Installation
There are builds for .NET 4.0 and .NET 4.5 split by set of packages 

### If you have full MVC application and want everything
* For MVC4 ```PM> Install-Package Reinforced.Lattice.Bundle.Mvc4```
* For MVC5 ```PM> Install-Package Reinforced.Lattice.Bundle.Mvc5```
Yes, after installing that *you do not have to install anything else*. You will get all Reinforced.Lattice wihtout other package's dependencies. For more sharp work you are welcome to install one of other packages.

### Otherwise, if you want only core library: here it is
* ```PM> Install-Package Reinforced.Lattice```

### Data transfer integration
* For MVC4 ```PM> Install-Package Reinforced.Lattice.Mvc4```
* For MVC5 ```PM> Install-Package Reinforced.Lattice.Mvc5```

### Also get these awesome extensions to template cells using Razor
* For MVC4 ```PM> Install-Package Reinforced.Lattice.Mvc4.Razor ```
* For MVC5 ```PM> Install-Package Reinforced.Lattice.Mvc5.Razor ```

### If you want to edit templates
* Under MVC4: ```PM> Install-Package Reinforced.Lattice.Templates.Mvc4```
* Under MVC5: ```PM> Install-Package Reinforced.Lattice.Templates.Mvc5```
* Twitter Bootstrap template to start with: ```PM> Install-Package Reinforced.Lattice.BootstrapTemplate```

### For JavaScript and typings
* ```PM> Install-Package Reinforced.Lattice.Script```
