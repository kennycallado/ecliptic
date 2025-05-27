import { Jodit } from "jodit/es2021/jodit.min.js";

import { PROJECT_NAME, PROJECT_TOKEN } from "$lib/client/consts.ts";

export default {
  iframe: false,

  uploader: {
    url: "/filefind/index.php?action=fileUpload",
    headers: {
      "X-WEBSLAB-Project": PROJECT_NAME,
      "X-WEBSLAB-Token": PROJECT_TOKEN, // authService.getToken(),
    },
    // prepareData: (formdata) => {
    // 	formdata.append("name", "Some parameter"); // $_POST['name'] on server
    // },
  },

  filebrowser: {
    ajax: {
      url: "/filefind/index.php",
      headers: {
        "X-WEBSLAB-Project": PROJECT_NAME,
        "X-WEBSLAB-Token": PROJECT_TOKEN, // authService.getToken(),
      },
    },
  },

  aiAssistant: {
    aiCommonPrefixPrompt: "Results will be in Spanish",
    aiCommonSuffixPrompt:
      "Please make the necessary changes to enhance the quality of the content. Text should be clear, concise, and engaging.",

    async aiAssistantCallback(
      prompt: string,
      htmlFragment: string,
    ): Promise<any> {
      // Make API call to OpenAI
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + "",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: prompt,
              },
              {
                role: "user",
                content: htmlFragment,
              },
            ],
          }),
        },
      );

      return response
        .json()
        .then((data) => {
          if (data.error) {
            throw new Error(data.error.message);
          }

          return (
            Jodit.modules.Helpers.get(
              "choices.0.message.content",
              data,
            ) ?? ""
          );
        });
    },
  },

  height: 550,
  minHeight: 400,
  // toolbarAdaptive: false,

  beautifyHTML: false,
  mediaInFakeBlock: false, // TODO: Check it works fine with images

  controls: {
    classSpan: {
      list: {
        "text-blue": "Blue",
        "text-danger": "Danger",
        "text-warning": "Warning",
        "lab-green": "Lab",
        "lab-green-invert": "Lab",
        "lab-blue": "Lab",
        "lab-blue-invert": "Lab",
        "lab-purple": "Lab",
        "lab-purple-invert": "Lab",
      },
    },
  },

  disablePlugins: ["color", "font", "about", "mobile", "backspace"],
  // extraButtons: ["question"],
};
