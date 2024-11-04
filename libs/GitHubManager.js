// https://superxnero.github.io/assets/libs/GitHubManager.js
class GitHubManager {
  constructor(token, username, currentRepo = null) {
    this.token = token;
    this.username = username;
    this.baseUrl = "https://api.github.com";
    this.currentRepo = currentRepo;
  }

  async createRepo(repoName, description = "", isPrivate = false) {
    const url = `${this.baseUrl}/user/repos`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: repoName,
        description: description,
        private: isPrivate
      })
    });

    if (response.ok) {
      const repoData = await response.json();
      this.currentRepo = repoData.name;
      return repoData;
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  }

  async getAllRepos() {
    const url = `${this.baseUrl}/users/${this.username}/repos`;
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });

    if (response.ok) {
      return await response.json();
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  }

  async getRepoContents(repo = this.currentRepo) {
    if (!repo) throw new Error("currentRepo is not set.");
    const url = `${this.baseUrl}/repos/${this.username}/${repo}/contents`;
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });

    if (response.ok) {
      return await response.json();
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  }

  setCurrentRepo(repoName) {
    this.currentRepo = repoName;
  }

  async createFileInFolder(path, content = "") {
    if (!this.currentRepo) throw new Error("currentRepo is not set.");
    const url = `${this.baseUrl}/repos/${this.username}/${this.currentRepo}/contents/${path}`;

    const encodedContent = btoa(content);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Add file",
        content: encodedContent
      })
    });

    if (response.ok) {
      return await response.json();
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  }

  async createEmptyFolder(folderPath) {
    const filePath = `${folderPath}/.gitkeep`;
    return await this.createFileInFolder(filePath, "");
  }

  async deletePath(path) {
    if (!this.currentRepo) throw new Error("currentRepo is not set.");
    const url = `${this.baseUrl}/repos/${this.username}/${this.currentRepo}/contents/${path}`;
    const fileData = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    }).then(res => res.json());
    
    console.log(fileData);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Delete path",
        sha: fileData.sha
      })
    });

    if (response.ok) {
      return await response.json();
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  }

  async renameFolder(oldPath, newPath) {
    if (!this.currentRepo) throw new Error("currentRepo is not set.");
    const folderContents = await fetch(`${this.baseUrl}/repos/${this.username}/${this.currentRepo}/contents/${oldPath}`, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    }).then(res => res.json());

    for (const item of folderContents) {
      await this.createFileInFolder(`${newPath}/${item.name}`, atob(item.content));
      await this.deletePath(`${oldPath}/${item.name}`);
    }
  }

  async updateFile(path, newName = null, newContent = null) {
    if (!this.currentRepo) throw new Error("currentRepo is not set.");
    const url = `${this.baseUrl}/repos/${this.username}/${this.currentRepo}/contents/${path}`;
    const fileData = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    }).then(res => res.json());

    const updatedPath = newName ? `${path.split('/').slice(0, -1).join('/')}/${newName}`: path;

    const updatedContent = newContent ? btoa(newContent): fileData.content;

    const response = await fetch(updatedPath === path ? url: `${this.baseUrl}/repos/${this.username}/${this.currentRepo}/contents/${updatedPath}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Update file",
        content: updatedContent,
        sha: fileData.sha
      })
    });

    if (updatedPath !== path) await this.deletePath(path);

    if (response.ok) {
      return await response.json();
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  }

  async updateRepoSettings(newSettings) {
    if (!this.currentRepo) throw new Error("currentRepo is not set.");
    const url = `${this.baseUrl}/repos/${this.username}/${this.currentRepo}`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${this.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newSettings)
    });

    if (response.ok) {
      return await response.json();
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  }

  async getFileContent(path) {
    if (!this.currentRepo) throw new Error("currentRepo is not set.");
    const url = `${this.baseUrl}/repos/${this.username}/${this.currentRepo}/contents/${path}`;
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
    if (response.ok) {
      const fileData = await response.json();
      const decodedContent = atob(fileData.content);
      return decodedContent;
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  }
}
export {
  GitHubManager
}
/*
- test using -

const gitHubManager = new GitHubManager(`${access_token}`, `${username}`, `${repo}`);
*/