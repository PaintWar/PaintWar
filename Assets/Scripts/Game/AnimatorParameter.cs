public enum AnimatorParameterType { Bool, Float, Int, Trigger }

public class AnimatorParameter
{
    public string Name { get; }
    public AnimatorParameterType Type { get; }
    public object Value { get; set; }

    public AnimatorParameter(string name, AnimatorParameterType type, object defaultValue)
    {
        Name = name;
        Type = type;
        Value = defaultValue;
    }
}