# Parts Planning Analysis Manager

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.0.
Current version is angular/cli ^8.3.29

## Development server

Install Internet Information services – this is done by updating windows 10
1.	open Control Panel
2.	click Programs
3.	Turn on Windows features on or off
4.	Select .Net Framework 3.5, .Net Framework 4.7
5.	Expand Internet Information Services
6.	Expand Web Management Tools
7.	Select IIS Management Console
8.	Select IIS Management Service
9.	Collapse Web Management Tools
10.	Expand World Wide Web Services
11.	Expand Application Development Features
12.	Select .NET Extensibility 4.7, ASP.Net 4.7, ISAPI Extensions, ISAPI Filters
13.	Collapse Application Development Features
14.	Expand Common HTTP Features
15.	Select Default Document, Directory Browsing, HTTP Errors, Static Content
16.	Collapse Common HTTP Features
17.	Expand Health and Diagnostics
18.	Select HTTP Logging, Request Monitor
19.	Collapse Health and Diagnostics
20.	Expand Performance Features
21.	Select Static Content Compression
22.	Collapse Performance Features
23.	Expand Security
24.	Select Basic Authentication, Request Filtering, Windows Authentication
25.	Collapse Security
26.	Press OK and wait for Windows 10 to update itself

Download and install the following:
•	https://nodejs.org/en/download/ - node.js – Windows .msi x64
•	https://www.npmjs.com/package/@angular/cli/v/8.3.29 - npmjs
•	Clone the repo:
    1.	Log into https://github.com/login using your aa.com email
    2.	Change the dashboard to AAInternal
    3.	Under Repositories, search for Material-Planning
    4.	Click Material-Planning
    5.	In Windows Explorer, create c:\AA-Dev
    6.	In the github browser tab, clone the project to c:\AA-Dev
    •	https://visualstudio.microsoft.com/subscriptions/ - Visual Studio 2019
    •	Open the cloned project in Visual Studio by clicking on C:\AA-Dev\material-planning\Material.Planning\Material.Planning.sln in a Windows Explorer window
    •	In the upper left menu, click Git, select Settings
    •	Select Source Control, Plug-in Selection, select Git
    •	Select Git Global Settings, Enter in Username, Email, and Repo location (default is fine)
    •	Check push matches fetch, click Save
    •	Check Commit change after merge by default
    •	Expand Git Repository Settings
    •	Select Remotes, Click Add
    •	Enter Origin in the name field, and in Fetch enter https://github.com/AAInternal/material-planning.git
    •	Click Ok
    •	Right click the solution in the solution explorer
    •	Click Mange Nuget Packages for solution
    •	Verify the following Nuget Packages are installed (If the below is not installed, install it now):
        a.	Microsoft.Asp.Net.WebApi.Core v5.2.7
        b.	Microsoft.AspNetCore.Authentication v2.2.0
        c.	Microsoft.AspNetCore.Authentication.JwtBearer v3.0.0/v5.0.4
        d.	Microsoft.AspNetCore.Cors v2.2.0
        e.	Microsoft.AspNetCore.SpaServices.Extensions v3.0.0/v5.0.4
        f.	Microsoft.AspNetCore.StaticFiles v2.2.0
        g.	Microsoft.CodeAnalsis.FxCopAnalyzers v2.9.8/v3.3.2
        h.	Microsoft.EntityFrameworkCore v3.0.0/v5.0.4
        i.	Microsoft.EntityFrameworkCore.Design v3.0.0/v5.0.4
        j.	Microsoft.EntityFrameworkCore.SqlServer v3.11/v5.0.4
        k.	Microsoft.EntityFrameworkCore.Tools v3.11/v5.0.4
        l.	Microsoft.Extension.Logging.Debug v3.11/v5.0.4
        m.	Microsof.VisualStudio.Web.CodeGeneration.Design v3.12/v5.0.2
        n.	Swashbuckle.AspNetCore.Annotations v6.0.0/v6.1.1
        o.	Swashbuckle.AspNetCore.SwaggerGen v6.0.0/v6.1.1
        p.	SwashBuckle.AspNetCore.SwaggerUI v6.0.0/v6.1.1
        q.	System.DirectoryServices.AccountManagement v4.7.0/v5.0.0
        r.	Teradata.Client.Provider v16.20.8/ v17.0.2
    •	Build the solution by right clicking the solution file and selecting Build
    •	To test swagger, right click dev.mp.api, select Set as Startup Project, then press F5 – a       browser window should be loaded displaying a list of api’s methods that can be tested
    •	https://nodejs.org/en/download/ - node.js – Windows .msi x64
    •	https://www.npmjs.com/package/@angular/cli/v/8.3.29 - npmjs
    •	https://code.visualstudio.com/download - Visual Studio Code
1.	Open Visual Studio Code
2.	Click Extensions on the left side and install the following extensions:
    •	Auto Import 1.5.3
    •	Beautify 1.5.0
    •	Bootstrap 4, Font Awesome 4, Font Awesome 5 Free & Pro snippets
    •	C# 1.23.9
    •	Debugger for Chrome
    •	Debugger for Firefox
    •	GitLen – Git supercharged 11.3.0
    •	Node.js Modules Intellisense 1.3.1
    •	Npm 0.3.17
    •	Npm Intellisense 1.3.1
    •	Partial Diff 1.4.2
    •	vscode-icons 11.2.0
3.	Click File, Select Open Workspace, Navigate to C:\AA-Dev\material-planning\Material.Planning\ClientApp
4.	In a terminal window, navigate to C:\AA-Dev\material-planning\Material.Planning\ClientApp  (to change directories type cd <directory>, then press return.  To navigate backwards type cd .., then press return)
5.	Type npm start – node will compile all the typescript
6.	In a browser window, navigate to http://localhost:4200
7.	https://desktop.github.com/ - github desktop (optional)

Review the following to get started
https://code.visualstudio.com/docs
1.	Click Node.js/javascript
2.	Review Working with javascript, Node.js Tutorial, Node.js Debugging, Node.js Deployment, Angular Tutorial, Extensions
3.	Review everything under Typescript

Run `ng serve` or `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
