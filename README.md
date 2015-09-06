# jekyll-optimized-build-process
A jekyll-based build process that optimizes scripts, styles, and images using GULP.

# Features
- Concats and minimizes JavaScript files
- Compiles SASS
- Autoprefixes styles
- Concats CSS files
- Compiles jekyll projects
- Allows splitting of vendor files and personal files for concatination (helps reduce site-download times)

# Requirements
- NodeJs
- Gulp
- Ruby/RubyGems
- Jekyll

# How to use
1. Create a project folder, this will be the root folder for the project
2. Place gulpfile.js and package.json in the root folder
3. Create a folder called "app" in the root folder, this will be where the source code for the project goes
4. Setup jekyll in the app folder
5. Run gulp in the root directory

## For JavaScript and CSS
### Javascript
To use JavaScript create a folder "_js" in the app directory.  In here is where all your personal JS files that you want to optimize will go.  For vendor scripts, in this folder create a subfolder "vendors" and place all vendor scripts in here.  Vendor scripts and personal scripts will be optimized seperately and must be included seperately.
#### To include optimized scripts
To use optimized scripts add the following two lines:
```
<script type="text/javascript" src="/js/vendors.min.js"></script>
<script type="text/javascript" src="/js/scripts.min.js"></script>
```

For best results add these to your footer as this will prevent rendor-blocking code.

### CSS
To use CSS create a folder "_css" in the app directory.  Here is where all your personal CSS files will be placed.  For vendor styles create a subfolder called "vendors" and place them there.  This is because vendor styles and personal styles will be optimized seperately.
#### To included optimized styles
To use the optimized stylesheets use the following lines:
```
<link rel="stylesheet" type="text/css" href="/css/vendors.min.css">
<link rel="stylesheet" type="text/css" href="/css/styles.min.css">
```

### For unoptimized CSS and JS files
Create a "css" or "js" folder in your app directory and place your files in the respective folders.  To use them add them as you would any other style/script.  Files in these directories will not be touched by the build process and will simply be coppied to the dist folder.
