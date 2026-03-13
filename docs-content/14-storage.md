FILE: /docs/storage

# File Storage

Astra provides a powerful filesystem abstraction that allows you to work with files using a consistent API, regardless of whether they are stored on your local disk or a cloud provider like Amazon S3.

## Configuration

Storage drivers are configured in your `config/storage.yaml` or through your main `astra.config.yaml`.

```yaml
storage:
  default: local
  disks:
    local:
      driver: local
      root: storage/app
    s3:
      driver: s3
      key: ${AWS_ACCESS_KEY_ID}
      secret: ${AWS_SECRET_ACCESS_KEY}
      region: ${AWS_REGION}
      bucket: ${AWS_BUCKET}
```

## Basic File Operations

You can interact with storage through the `Storage` service, which is typically registered in the application container.

```go
func HandleUpload(c *http.Context) error {
    store := c.App.Get("storage").(storage.Driver)
    
    // Save a raw string/bytes to a file
    err := store.Put(c.Ctx(), "greetings.txt", []byte("Hello Astra!"))
    
    // Check if a file exists
    exists, _ := store.Exists(c.Ctx(), "greetings.txt")
    
    // Get file contents
    content, _ := store.Get(c.Ctx(), "greetings.txt")
    
    // Delete a file
    err = store.Delete(c.Ctx(), "greetings.txt")
}
```

## Handling Uploaded Files

Astra's `http.Context` includes helpers that make handling multipart form uploads a breeze. The `UploadedFile` object can be directly passed to the storage driver.

```go
func UploadAvatar(c *http.Context) error {
    file, err := c.FormFile("avatar")
    if err != nil {
        return c.Error(400, "No file uploaded")
    }

    // Validate the file (size, mime type)
    if err := file.Validate(http.ValidateOptions{
        MaxSize: 2 * 1024 * 1024, // 2MB
        AllowedExtensions: []string{"jpg", "png"},
    }); err != nil {
        return c.ValidationError(err)
    }

    // Store the file using the default disk
    store := c.App.Get("storage").(storage.Driver)
    path := fmt.Sprintf("avatars/%d-%s", c.AuthUser().UserID, file.Name)
    
    if err := file.Store(c.Ctx(), store, path); err != nil {
        return err
    }

    return c.JSON(map[string]string{"path": path})
}
```

## Public vs Private Files

By default, files stored in the `storage/app` directory are not publicly accessible. To make files public, you should use the `public` disk (if configured) or create a symbolic link from your public directory to your storage directory.

```bash
astra storage:link
```

This creates a link at `public/storage` that points to `storage/app/public`.

## Generating URLs

### Public URLs
If you are using the `local` driver with a public link, you can generate a URL manually or use a helper:

```go
url := "/storage/" + filename
```

### Temporary (Signed) URLs
For private files (especially on S3), you can generate temporary URLs that expire after a certain amount of time.

```go
// Generate a URL valid for 30 minutes
url, err := store.SignedURL(c.Ctx(), "sensitive-report.pdf", 30 * time.Minute)
```

## Testing Storage

Astra includes a `memory` driver that is perfect for unit testing. It allows you to verify file operations without actually writing to the disk.

```go
func TestFileUpload(t *testing.T) {
    store := storage.NewMemoryDriver()
    // ... use store in your tests ...
}
```

## Next Steps

-   [HTTP Context](/docs/http-context) — More details on the `UploadedFile` helpers.
-   [Testing](/docs/testing) — Learn how to mock storage in your integration tests.
-   [Deployment](/docs/deployment) — Configuration tips for production cloud storage.
