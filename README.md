# NutrientView
NutrientView is a nutritient tracking image recognition mobile app developed by Syed Rizvi.

The aim of the app is to provide users with an easy viewing experience of what nutrients they are getting enough
of through their diets, and what they are deficient in. The app has food image recognition built in using IBM 
Watson image recognition services, which allows users to simply take a photo of their food to log it automatically. 
There is also a manual input option if the user needs to enter specialized food that is not in the system.

This mobile app is not for dieting or exercise regimens, as there are plenty of existing apps that fulfill that
function already. This app is instead focused on giving users a clean and easily-viewable micronutrient profile,
to show them what nutrient deficiencies their current diets put them in.

## Features
- Image recognition and manual entry options for logging meals
- Daily nutrient progress meters based on the recommended daily allowances of micronutrients
- Calendar that can pull up nutrient data from previous days
- A Q&A bot service that can give users basic information about important nutrients

## Screenshots
![NutrientView Screenshots](/assets/nutrientview_screens.png)

## Frameworks and APIs
- React Native/Expo
- IBM Watson food image recognition
- Microsoft Azure Bot Service, QnA maker, and Cognitive Services
- Firebase Realtime Database, Storage, and Hosting
- Edamam Nutrition Analysis API service
