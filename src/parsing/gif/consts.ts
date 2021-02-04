export enum ASCIIByte {
  comma = 44,       // ','
  semicolon = 59,   // ';'
  G = 71,
  I = 73,
  F = 70,
}

export enum Extension {
  blockLabel = 33,
  applicationLabel = 255,
}

export enum GIFSpecialSymbol {
  imageSeparator = ASCIIByte.comma,
  gifTermination = ASCIIByte.semicolon,
}

export enum GIFDescriptorBlock {
  start = 6,
  size = 7,
}

export enum ColorMapBlock {
  start = GIFDescriptorBlock.start + GIFDescriptorBlock.size,
  entriesCount = 3,
}

export enum ImageDecriptorBlock {
  size = 10,
}
