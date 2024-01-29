using backend.Entities;

namespace backend.DTOs;

public record AuthorDto(string Id, string FirstName, string LastName, string Email);

public record ChatRoomWithHistoryDto(int Id, IEnumerable<ApplicationUserDto> Members, IEnumerable<HistoryDto> History);

public record AddChatWithUserDto(string Email);

public record ChatRoomCreatedDto(int Id, IEnumerable<ApplicationUserDto> Members);

public record CompleteRegistrationDto(string FirstName, string LastName);