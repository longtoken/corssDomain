# corssDomain
关于前端跨域问题<br>
* 跨域方法<br>
  js跨域是指通过js在不同的域之间进行数据传输或通信，比如用ajax向一个不同的域请求数据，或者通过js获取页面中不同域的框架中(iframe)的数据。只要协议、域名、端口有任何一个不同，都被当作是不同的域。<br>
  jsonp虽然兼容性好，但是只支持get，毕竟只是插一段JS到前端页面。<br>
  CORS除了在IE的兼容性不怎么好，也没什么其它问题，现在应该是跨域处理的主流方式。后端只需要配置个头信息就可以。<br>
  iframe设置document.domain之后就可以方便地进行数据交互，使用问题就是对域名有限制。<br>
  window.name这个方法在firefox有兼容问题，用这个方法感觉不靠谱。<br>
  postMessage比设置document.domain要好一点，比较少用来跨域，毕竟支持postMessage还不如直接用CORS。不过这个方法在web worker上是不可缺少的。<br>
  nginx也是蛮简单的，让运维设置下就好。自己本地也经常会用来跨域跟后端联调。<br>
===========================

一、**jsonp**<br>
jsonp的原理是通过script标签引入一个js文件，这个js文件载入成功后会调用一个函数，这个函数由后台开发取好名字，前端在页面上配合定义这个函数，这样后台开发就能在把需要的数据通过函数的参数传递过来。<br>
一般都是由开发设置一个callback参数，前端调用的时候传入改参数的值，这个值就是函数的名字。<br>
<br>
===========================
二、**CORS**<br>
CORS(Cross-Origin Resource Sharing)即跨域资源共享，是一种实现跨域访问的方法，为了让AJAX可以实现可控的跨域访问而生的。<br>
CORS的实现原理很简单，只需要在响应端的头信息配置一个Access-Control-Allow-Origin的响应信息即可。<br>
支持chrome、firefox、IE8或以上的浏览器<br>
---1. 使用CORS注意url需要是绝对路径<br>
---2.  当IE8、9使用CORS的时候需要使用通过new XDomainRequest() 进行创建，open方法只有method和url两个参数，XDR只支持异步不支持同步操作。[详情](https://developer.mozilla.org/zh-CN/docs/Web/API/XDomainRequest)<br>
---3. 设置Access-Control-Allow-Origin: *，注意这里的*是指所有来源都可以调用该接口。最好指定绝对路径。<br>
<br>
===========================
三、**document.domain**<br>
同源策略，其限制之一就是不能通过ajax的方法去请求不同源中的文档。<br>第二个限制是浏览器中不同域的框架之间是不能进行js的交互操作的。但是不同的框架之间（父子或同辈），是能够获取到彼此的window对象的，但你却不能使用获取到的window对象的属性和方法(html5中的postMessage方法是一个例外，还有些浏览器比如ie6也可以使用top、parent等少数几个属性)。比如[http://www.a.com/a.html]()跟[http://a.com/b.html]()是无法获取有效的属性。这个时候document.domain就可以派上用场了，我们只要把[http://www.a.com/a.html]() 和 [http://a.com/b.html]()这两个页面的document.domain都设成相同的a.com域名就可以了。<br>
---1. document.domain的设置是有限制的，只能把document.domain设置成自身或更高一级的父域，且主域必须相同。例如：a.b.com中某个文档的document.domain可以设成a.com、b.com中的任意一个，但是不可以设成 d.a.b.com,因为这是当前域的子域。也不可以设成x.com,因为主域已经不相同了。<br>
---2. 想在[http://www.a.com/a.html]() 页面中通过ajax直接请求[http://a.com/b.html]() 页面，即使你设置了相同的document.domain也还是不行的，修改document.domain的方法只适用于不同子域的框架间的交互。<br>
---3. 可以用一个隐藏的iframe来做一个代理。原理就是让这个iframe载入一个与你想要通过ajax获取数据的目标页面处在相同的域的页面，所以这个iframe中的页面是可以正常使用ajax去获取你要的数据的，然后就是通过修改document.domain的方法，让我们能通过js完全控制这个iframe，这样我们就可以让iframe去发送ajax请求，然后收到的数据我们也可以获得了。<br>
<br>  
===========================
四、**window.name**<br>
window对象有个name属性，该属性有个特征：即在一个窗口(window)的生命周期内,窗口载入的所有的页面都是共享一个window.name的，每个页面对window.name都有读写的权限，window.name是持久存在一个窗口载入过的所有页面中的，并不会因新页面的载入而进行重置。<br>
比如说在a.html页面中设置了window.name，然后修改location.href使其跳转到b.html。b.html使用console.log(window.name);这样b.html就获取到a.html的信息（不管a.html与b.html处于相同或不同的域中）。<br>
---1. b.html页面上成功获取到了它的上一个页面a.html给window.name设置的值。如果在之后所有载入的页面都没对window.name进行修改的话，那么所有这些页面获取到的window.name的值都是a.html页面设置的那个值。当然，如果有需要，其中的任何一个页面都可以对window.name的值进行修改。<br>
---2. window.name的值只能是字符串的形式，这个字符串的大小最大能允许2M左右甚至更大的一个容量，具体取决于不同的浏览器，但一般是够用了。<br>
---3. 两个不同域的页面如a.html跟x.html，首先在x.html页面上设置想要获取的window.name，然后在a.html中设置一个隐藏的iframe，由iframe去获取x.html的值，在让a.html去获取iframe上的值。iframe的src设置为x.html，a.html页面将iframe的src设置为跟a.html同域的b.html，然后在iframe.onload的时候获取iframe.contentWindow.name的值。<br>
<br>  
===========================
五、**window.postMessage**<br>
window.postMessage(message,targetOrigin)  方法是html5新引进的特性，可以使用它来向其它的window对象发送消息，无论这个window对象是属于同源或不同源，目前IE8+、FireFox、Chrome、Opera等浏览器都已经支持window.postMessage方法。<br>
---1. 调用postMessage方法的window对象是指要接收消息的那一个window对象，该方法的第一个参数message为要发送的消息，类型只能为字符串；第二个参数targetOrigin用来限定接收消息的那个window对象所在的域，如果不想限定域，可以使用通配符 *  。<br>
---2. 需要接收消息的window对象，可是通过监听自身的message事件来获取传过来的消息，消息内容储存在该事件对象的data属性中。<br>
---3. 上面所说的向其他window对象发送消息，其实就是指一个页面有几个框架的那种情况，因为每一个框架都有一个window对象。在讨论第二种方法的时候，我们说过，不同域的框架间是可以获取到对方的window对象的，而且也可以使用window.postMessage这个方法。比如a.html上有一个iframe，src指向b.html，在iframe.onload的时候设置iframe.contentWindow.postMessage('a.html info','*');然后在b.html上监听window.onmessage就能获取a.html传入的数据。<br>
<br>  
===========================
六、**nginx反向代理**<br>
用nginx反向代理实现跨域，是最简单的跨域方式。只需要修改nginx的配置即可解决跨域问题，支持所有浏览器，支持session，不需要修改任何代码，并且不会影响服务器性能。<br>
配置nginx，在一个服务器上配置多个前缀来转发http/https请求到多个真实的服务器即可。这样，这个服务器上所有url都是相同的域名、协议和端口。因此，对于浏览器来说，这些url都是同源的，没有跨域限制。而实际上，这些url实际上由物理服务器提供服务。这些服务器内的javascript可以跨域调用所有这些服务器上的url<br>
<br>  
===========================

