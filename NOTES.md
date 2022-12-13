# Notes 

## Your Alexa Skills

Log in to the Alexa developer and make your own custom skills. 

- See all your skills at <https://developer.amazon.com/alexa/console/ask>.

## Requirements 

You'll want the following on your machine:

- Git
- VS Code

## Similar Skills

You are welcome to fork this code and modify it for your own custom skills and schedules. 
Be sure to review and include the license when doing so. 

## Code in AWS and GitHub

The following sections are helpful to maintain your code in both AWS (for deployment) and GitHub (for maintenance). 
You'll only be able to push code for skills and repos you colaborate on (not just contribute).

## Initial Integration with VS Code

Integrate your code with VS Code.

While in AWS, building your skill, access "Code" / "Offline Tools" / "Export to VS Code".

## Git Remotes

There are 2 git remotes:

- the AWS deployment site (origin)
- the GitHub repo (github)

Create the first one from within the Alexa Developers console.

Then (just once) open a bash shell and run (modify the command based on your repo URL):

`git remote add github https://github.com/denisecase/TimberwolfTracker-Boysbasketball.git`

## Branches 

The origin remote has 2 branches (at least): master and prod.

The github remote has just main.

Switch between branches to push to both places. 

To push change to GitHub as well, change branch, verify, push, and return to master. 

Open a new terminal. Make it a __bash__ shell. Then, run the following commands:

```
git branch -M main
git branch
git push github main
git branch -M master
git branch
```

Or - once you're used to branches:

```
git branch -M main
git push github main
git branch -M master
```
