FILE: /docs/validation

# Request Validation

Astra provides a declarative, tag-based validation system that makes it easy to ensure your application only processes clean, well-formatted data. It integrates directly with the HTTP `Context` and the `go-playground/validator` engine.

## Basic Validation

The most common way to validate data is by using struct tags in your request models.

```go
type CreateUserRequest struct {
    Email           string `json:"email" validate:"required,email"`
    Password        string `json:"password" validate:"required,min=8"`
    ConfirmPassword string `json:"confirm_password" validate:"required,eqfield=Password"`
}
```

## Validating in Handlers

You can use the `BindAndValidate` helper on the `Context` to both unmarshal the JSON body and run validation rules in a single step.

```go
func Store(c *http.Context) error {
    var input CreateUserRequest
    
    if err := c.BindAndValidate(&input); err != nil {
        // Automatically returns 422 Unprocessable Entity with error details
        return c.ValidationError(err) 
    }
    
    // Data is now guaranteed to be valid
    return c.JSON(map[string]string{"message": "User created"})
}
```

## Common Validation Rules

Astra supports all standard `go-playground/validator` rules. Here are the most common ones:

- `required`: Field must not be empty or zero-valued.
- `email`: Field must be a valid email address.
- `min=n` / `max=n`: Minimum or maximum length for strings, or value for numbers.
- `len=n`: Exact length.
- `eq=n`: Value must equal `n`.
- `oneof=a b c`: Value must be one of the space-separated list.
- `datetime=2006-01-02`: Must be a valid date in the given format.
- `url`: Must be a valid URL.

## Custom Error Messages

While Astra provides sensible defaults, you can customize how validation errors are returned by implementing the `Translatable` interface or using Astra's i18n system.

### Structured Error Response
When `c.ValidationError(err)` is called, Astra returns a JSON response like this:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The given data was invalid.",
    "fields": {
      "email": "The email field must be a valid email address.",
      "password": "The password field must be at least 8 characters."
    }
  }
}
```

## Database-Backed Validation

Sometimes you need to validate data against your database (e.g., ensuring an email is unique). In Astra, this is typically handled in your controller or service layer after the basic format validation passes.

```go
if err := c.BindAndValidate(&input); err != nil {
    return c.ValidationError(err)
}

// Check for uniqueness in DB
exists, _ := orm.Query[models.User](db).Where("email", "=", input.Email).Exists(ctx)
if exists {
    return c.Error(http.StatusConflict, "Email is already taken")
}
```

## Custom Rules

You can register custom validation rules in your `AppProvider`.

```go
func (p *AppProvider) Boot(a *core.App) error {
    v := a.Get("validator").(*validate.Validator)
    
    v.RegisterRule("is_even", func(fl validate.FieldLevel) bool {
        return fl.Field().Int() % 2 == 0
    })
    
    return nil
}

// Usage in struct:
type Input struct {
    Number int `validate:"is_even"`
}
```

## Next Steps

- [HTTP Context](/docs/http-context) — Explore more helpers for binding and data extraction.
- [ORM & Models](/docs/orm) — See how validation rules align with your database schema.
- [Error Handling](/docs/http-context) — Learn how to customize global error responses.
