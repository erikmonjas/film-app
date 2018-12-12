# OMDb-based Film App
This is a demo film app created thanks to the OMDb API open movie database. It was made with a 100% ES5 Vanilla Javascript. Search films, register and add them to your favs!

[Enjoy it here](https://erikmonjas.github.io/film-app/index.html)

## Home page
Initially, you can search here for any movie by its title. If you're registered, you'll see your favourites list below. 

You can go register by clicking the upper right-hand button. You wont't be able to login with a user and password, even if you accessed the page before and registered it as user data is stored in sessionStorage. Nevertheless, favourites are saved in localStorage, so if you register the same user you did before, you'll be able to see the favourites you saved previously. 

You'll be asking yourself why didn't I stored the user data in localStorage, well, it was an exercise that involved working with both local and session storages and user data was recquired to be saved in the session one.

Once you're registered, you'll be able to add favourites just by clicking on the star icon. You can also get more information about a specific movie by clicking the "More info" button.

## Detail page

Here the film details are shown. If you added it to favourites, a full star icon will be shown, otherwise it'll appear empty. You can add it or remove it from your favourites list just by clicking on the star.

## Register page

Simply type something into the user and password fields and submit the register form. Then, you'll be redirected to the home screen and your user name will be shown on the upper right corner.
