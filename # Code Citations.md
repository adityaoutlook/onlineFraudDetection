# Code Citations

## License: unknown
https://github.com/tranquocvu222/DemoThesis/tree/b5023f469547bc617c0ea40cd3808e3329dd4051/src/main/java/demo/homestay/controller/UserController.java

```
{
    @Autowired private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        return userService.register(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User
```

