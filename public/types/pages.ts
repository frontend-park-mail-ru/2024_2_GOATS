export type PageItem = {
  text: string;
  href: string;
  id: string;
  render: () => void;
  isAvailable?: boolean;
};

export type PageConfig = {
  pages: {
    [key: string]: PageItem;
  };
};
