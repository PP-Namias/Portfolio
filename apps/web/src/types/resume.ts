// Resume types for CMS integration
export interface Resume {
  _id: string;
  resumeFile: {
    asset: {
      _ref: string;
      url: string;
      originalFilename?: string;
    };
  };
  isActive: boolean;
}
