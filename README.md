# bitbucket-redmine-sync

# Установка

* склонируйте репозиторий
* выполните

<pre><code>
$ git submodule init
$ git submodule update
</code></pre>

* в хроме выберете установку распакованного расширения, указав путь до репозиторя
![image](http://xtendedview.com/wp-content/uploads/Install-chrome-extensions-offline_640x334.jpg)

# Настройка

* перейдите в настройки, и задайте соответствие redmine-bitbucket в виде
```json
{
  "owner": {
    "redmine-project-id":"bitbucket-repo",
    "redmine-project-id-2":"bitbucket-repo-4"
  },
  "owner-2": {
    "redmine-project-id-3":"bitbucket-repo-3",
    "redmine-project-id-4":"bitbucket-repo-4"
  }
}
```
* получение bitbucket-токена
![image](docs/img/bitbucket-token-1.png)
![image](docs/img/bitbucket-token-2.png)
