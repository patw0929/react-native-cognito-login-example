React-Native Cognito Login Example App
---

<img src="http://i.imgur.com/VJi9H8V.png" width="300" />

## Packages

* [react-native](https://github.com/facebook/react-native) 0.44
* [aws-sdk-react-native](https://github.com/awslabs/aws-sdk-react-native) (Custom packed version)
* [react-native-facebook-login](https://github.com/magus/react-native-facebook-login) 1.5.0
* [react-native-google-signin](https://github.com/devfd/react-native-google-signin) 0.10.0
* [react-native-loading-spinner-overlay](https://github.com/joinspontaneous/react-native-loading-spinner-overlay) 0.5.0

## About login

Based on [Amazon Cognito](https://aws.amazon.com/cognito/) to implement the login flow, and save the member data on it too.

I also used the [Amazon Lambda](https://aws.amazon.com/lambda/) & [Amazon API Gateway](https://aws.amazon.com/api-gateway/) to make a serverless API service, to complete the register/retrieve member data flow.

The lambda script repo is at [here](https://github.com/patw0929/cognito-login-example-api-aws-lambda).

## Intro

Please refer to this article (Chinese):

[使用 REACT NATIVE 與 AMAZON COGNITO 實作 GOOGLE & FACEBOOK 登入的功能](http://blog.patw.me/archives/1372/using-react-native-and-amazon-cognito-to-develop-google-facebook-login-feature-in-android-ios-app/)

## Related project

Lambda API (for user registration):

[https://github.com/patw0929/cognito-login-example-api-aws-lambda](https://github.com/patw0929/cognito-login-example-api-aws-lambda)
