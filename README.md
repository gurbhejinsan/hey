# Hey CLI Tool

A powerful CLI for scaffolding and managing React/Vite/your-stack projects efficiently.

[![npm version](https://img.shields.io/npm/v/your-cli)](https://npmjs.com/package/your-cli)  
[![license](https://img.shields.io/github/license/yourusername/your-cli)](LICENSE)

---

## Features

- Quick scaffolding for React/Vite projects (customizable for your tool)  
- Component/library/theme generation (if applicable)  
- Extensible commands/plugins  
- Cross-platform support (Windows/macOS/Linux)  
- Easy integration with existing projects  

---

## Installation

### Requirements

- Node.js version X.X+  
- npm or yarn  
- Supported OS: Windows, macOS, Linux  

### Install globally

```
npm install -g hey
# or
yarn global add hey
```

---

## Usage

```
hey init my-project
hey add  Button
hey --help
```

- **init**: Initialize a new project  
- **add**: Generate files/components  
- **--help**: Show help and list of commands  

Example:  
Running `hey init my-project` sets up the base directory structure and installs dependencies.

---

### Commands
| Command                          | Description                       |
|----------------------------------|-----------------------------------|
| `hey init [name]`                | Initialize a new hey project      |
| `hey add <template> [name]`      | Add a template to your project    |   
| `hey list`                       | List all available templates      |   

### Exmaple
| Command                          | Description                                  |
|----------------------------------|----------------------------------------------|
| `hey init my-project `           | Initialize a new project called "my-project" |
| `hey add button `                | Add the button template to your project      |
| `hey add button MyCustomButton`  | Add button template with custom name         |   
| `hey list `                      | List all available templates                 |   



---

## Configuration

Your CLI supports configuration via a `myproject.config.json` in the project root.

Example (JSON format):

```json
{
  "name": "new",
  "version": "1.0.0",
  "folders": {
    "components": "src/components",
    "hooks": "src/hooks",
    "providers": "src/providers",
    "utils": "src/utils",
    "constants": "src/constants"
  },
  "createdAt": "2025-07-24T06:52:18.152Z"
}

```

- Customize framework, language, styling, and output directory.  
- CLI reads this file to apply default preferences when scaffolding.

---

## Project Structure Example

After initializing or generating, a typical project directory might look like:

````
dist
├── package.json
├── index.js
├── node_modules
├── src/
│   ├── commands/
│   │   ├── add.ts
│   │   └── init.ts
│   ├── templates/
│   │   ├── components.ts
│   │   ├── hooks.ts
│   │   └── utils.ts
│   ├── utils/
│   │   ├── index.ts
│   │   └── logger.ts
│   ├── main.ts
│   └── types.ts
├── package-lock.json
├── tsconfig.json
└── README.md

````

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository  
2. Create a feature branch (`git checkout -b feature/YourFeature`)  
3. Commit your changes (`git commit -m 'Add some feature'`)  
4. Push to the branch (`git push origin feature/YourFeature`)  
5. Open a pull request  

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md) and the [Contribution Guidelines](CONTRIBUTING.md).

---
<!-- 
## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

--- -->

## Author & Contact

**Your Name**  
- GitHub: [@gurbhejinsan](https://github.com/gurbhejinsan)  
<!-- - Twitter: [@yourhandle](https://twitter.com/yourhandle)   -->
<!-- - Email: your.email@example.com   -->

---

## Professional Tips & Best Practices

- Use badges for npm version, license, build status to increase credibility.  
- Show minimal and advanced usage examples for different user levels.  
- Link to issue tracker or community chat for support.  
- Keep your README concise but link to in-depth docs.  
- Include troubleshooting and FAQ if relevant.  
- State system compatibility and any limitations.

---
*⭐ If you find this project useful, please give it a star !*
