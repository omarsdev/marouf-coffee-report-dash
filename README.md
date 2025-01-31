# Darsi

(Client App)

## Git Repo

```
git remote rm origin
git remote add origin https://gitlab.com/vuedale/darsi/cms.git
git branch -M main
git push -uf origin main
```

## Installation

###### Required Software & Technologies

- [Node JS](https://nodejs.org/en/download/)
- [React Native CLI](https://reactnative.dev/docs/environment-setup#:~:text=You%20will%20need%20Node%2C%20Watchman,React%20Native%20app%20for%20Android.)
- [CocoaPods](https://cocoapods.org/)
- [Android Studio](https://developer.android.com/studio?gclid=CjwKCAiAlrSPBhBaEiwAuLSDUHs3Ul0hNh2z9gaSwfKalx9UPa9pc0vQvaBgxcZPgKLSG9ECuZZsghoCvRIQAvD_BwE&gclsrc=aw.ds) _(for Andriod)_
- [XCode](https://developer.apple.com/xcode/) _(for iOS)_

Use the package manager [npm](https://pip.pypa.io/en/stable/) to install the node modules.

```javascript
npm i
```

Download [Pods](https://cocoapods.org/) then go to the iOS directory and run

```python
pod install --project-directory=ios

# If pod project is initiated (podfile.lock and pods exist)
cd ios && pod deintegrate && pod install && cd ..
```

Start Metro Bundler on desired port (8081 default)

```javascript
> npx react-native start --port=8081
```

### iOS

Requirments:

- [XCode](https://developer.apple.com/xcode/)
- MacOS

```
npx react-native run-ios --port 8088
```

### Android

Requirments:

- [Java SDK](https://www.oracle.com/java/technologies/downloads/)
- [Android Studio](https://developer.android.com/studio?gclid=CjwKCAiAlrSPBhBaEiwAuLSDUHs3Ul0hNh2z9gaSwfKalx9UPa9pc0vQvaBgxcZPgKLSG9ECuZZsghoCvRIQAvD_BwE&gclsrc=aw.ds)

```
npx react-native run-android --port 8088
```

## Usage

```python
import foobar

# returns 'words'
foobar.pluralize('word')

# returns 'geese'
foobar.pluralize('goose')

# returns 'phenomenon'
foobar.singularize('phenomena')
```

## Ownership

All software, code and solutions included in this project is property of Vuedale LLC

## Support

For any inqueries; come say hello@vuedale.com, do not hesitate to include any attachments and we'll get back to you.
