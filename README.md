# Git Scripts

Wrapper scripts

[npm](https://www.npmjs.com/package/git-hooks-wrapper)

```
npm install git-hooks-wrapper
```

## Docs

https://www.atlassian.com/git/tutorials/git-hooks

| action   | hook               | source | args                                                         | exit 1 |
| -------- | ------------------ | ------ | ------------------------------------------------------------ | ------ |
| commit/0 | pre-commit         | local  | -                                                            | abort  |
| commit/1 | prepare-commit-msg | local  | 1.  message file path<br />2. type<br />- message: -m \| -F<br />- template: -t<br />- merge<br />- squash<br />3. sha? for -c -C --amend | abort  |
| commit/2 | commit-msg         | local  | message file path                                            | abort  |
| commit/3 | post-commit        | local  |                                                              | -      |
| push/0   | pre-receive        | remote |                                                              |        |
| push/1   | update             | remote |                                                              |        |
| push/2   | post-receive       | remote |                                                              |        |

## pre-commit

[https://codeinthehole.com/tips/tips-for-using-a-git-pre-commit-hook/](https://codeinthehole.com/tips/tips-for-using-a-git-pre-commit-hook/)

## Note

https://github.com/typicode/husky
