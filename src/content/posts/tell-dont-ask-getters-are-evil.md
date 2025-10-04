---
title: 'Tell, Don’t Ask: Getters Are Evil'
pubDate: '2020-03-21 05:49:46 +0100'
categories:
  - Software design
---

![tell dont ask](/assets/tell_dont_ask.jpg "tell dont ask")

Many times we were told that getters are evil and we should stop using them.

So, What is wrong with getters ?

Well, it leaks abstraction and you expose the internal structure of your objects (which is not OOP). as a result you have your business logic scattered around and not centralized, next thing, you’ll have duplicated business logic which is not good at all as you might guess.

you might argue that you have a service (`ProductService`) that calculates the price of product and takes in charge of the business logic, if you do, then you need to expose the `price` with a `getPrice` for example, and you may be calling this `getPrice` on the view directly as it’s already a POJO, next thing you figure that you should convert it to the customer’s currency, and “BAM”, you (or another developer 🙂 ) implement this in the view because it’s so simple. and in many other cases you’ll find yourself calling `getPrice` on the product object and then you start implementing the expected behavior. but one of the developers will forget the tax, another will forget a promotion. etc. you get the idea.

You should also think about future developers, they’ll find it easier to grab the data and do the logic quickly instead of adding it to the Service and then injecting the service (Maybe there are many layers that need to be injected). This point means that you need to train new developers and especially juniors or hire only seniors (Yeah it’s costy). Or, you can opt for the simple solution. Better design your application and separate the persistence and the view model from the domain model.

But then, when do getters makes sense, and are mandatory, well, as long as they are used to expose information to other layers. Which means you can create your persistent model through getters in your domain model.

```java
class Product {
	private double cost;
	double getCostFor(int quantity) {
		return cost * quantity;
	}
	
	double getCost() {
		return cost;
	}
}
```
There is no problem with this as long as the `getCost()` is only used to create a DTO.

However, this is not the best idea.

```java
class Product {
	ProductDto toDto() { 
		return new ProductDto(cost);
	}
}
```
It says, the domain object knows about the DTO, which sounds like a fancy word for a getter. And it’s even worse, because a DTO should not have any logic. All the issues you want to avoid when you’re not using getters you can have when using DTO’s this way.

So, for now, I stick with the first approach to exchange data. Make sure to implement a method where It makes sense. If I used the `getCost()` to perform logic I’m 100% aware of It cause It makes sense In the context.

