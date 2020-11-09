export const commonReducer = (state, action) => {
  const mapActions = {
    update: () => {
      return { ...state, [action.key]: action.value }
    },
  }

  return mapActions[action.type]()
}
