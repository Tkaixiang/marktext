import bus from '../../bus'

export const newFile = (): void => {
  bus.emit('SIDEBAR::new', 'file')
}

export const newDirectory = (): void => {
  bus.emit('SIDEBAR::new', 'directory')
}

export const copy = (): void => {
  bus.emit('SIDEBAR::copy-cut', 'copy')
}

export const cut = (): void => {
  bus.emit('SIDEBAR::copy-cut', 'cut')
}

export const paste = (): void => {
  bus.emit('SIDEBAR::paste')
}

export const rename = (): void => {
  bus.emit('SIDEBAR::rename')
}

export const remove = (): void => {
  bus.emit('SIDEBAR::remove')
}

export const showInFolder = (): void => {
  bus.emit('SIDEBAR::show-in-folder')
}
