import axios from "axios";

const VISION_API_KEY = "AIzaSyCEkT7JAkYTlkTlBgHu4C-Jkj03KdqFguo";
const VISION_API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${VISION_API_KEY}`;

export interface VisionResponse {
  description: string;
  allLabels: string[];
}

export const analyzeFoodImage = async (
  base64String: string
): Promise<VisionResponse> => {
  try {
    const rawBase64 = base64String.replace(
      /^data:image\/(png|jpeg|jpg);base64,/,
      ""
    );

    const requestPayload = {
      requests: [
        {
          image: { content: rawBase64 },
          features: [
            { type: "LABEL_DETECTION", maxResults: 10 },
          ],
        },
      ],
    };

    const response = await axios.post(VISION_API_URL, requestPayload);

    const labels = response.data.responses[0]?.labelAnnotations || [];
    const allLabels = labels.map((l: any) => l.description);

    if (allLabels.length > 0) {
      return {
        description: allLabels[0],
        allLabels: allLabels,
      };
    }

    return {
      description: "Unknown Item",
      allLabels: [],
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Vision API Axios Error:",
        error.response?.data?.error?.message || error.message
      );
      throw new Error(
        `Vision API Error: ${error.response?.data?.error?.message ||
        "Check your API Key and Google Cloud billing settings."
        }`
      );
    }
    console.error("Vision API Error:", error);
    throw new Error(
      "Failed to classify image. Please check API settings or enter details manually."
    );
  }
};

