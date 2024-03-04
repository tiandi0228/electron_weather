type SetUpProps = { onChange: (isVisible: boolean) => void }

function SetUp(props: SetUpProps): JSX.Element {
  return (
    <div>
      <div className="">X</div>
      <div className="mt-4">
        <input
          className="w-full h-10 px-2 rounded-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          placeholder="请输入和风天气key"
        />
      </div>
      <div className="mt-4">
        <button
          className="w-full h-10 rounded-sm bg-blue-400 hover:bg-blue-500 text-white"
          onClick={() => {
            props.onChange(false)
          }}
        >
          保存
        </button>
      </div>
    </div>
  )
}

export default SetUp
